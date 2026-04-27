import { databaseService } from './database.service';
import { settingsService } from './settings.service';
import { Profile } from '../types';

export class ProfileService {
  async getProfiles(): Promise<Profile[]> {
    const res = await databaseService.query('SELECT * FROM profiles');
    return res.values || [];
  }

  async addProfile(profile: Omit<Profile, 'id' | 'passcode'> & { passcode?: string | null }): Promise<Profile> {
    const id = crypto.randomUUID();
    const hashedPasscode = profile.passcode ? await this.hashPasscode(profile.passcode) : null;
    const profileToSave = { ...profile, id, passcode: hashedPasscode } as Profile;
    
    await databaseService.run(
      'INSERT INTO profiles (id, name, passcode, role, tier, status, lastActive, image, color, currency, monthlySalary, salaryDay, salarySource, salaryWalletId, autoAddSalary, lastSalaryAdded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        profileToSave.id, profileToSave.name, profileToSave.passcode, profileToSave.role, profileToSave.tier,
        profileToSave.status, profileToSave.lastActive, profileToSave.image, profileToSave.color, profileToSave.currency,
        profileToSave.monthlySalary || 0, profileToSave.salaryDay || 1, profileToSave.salarySource || null,
        profileToSave.salaryWalletId || null, profileToSave.autoAddSalary ? 1 : 0, profileToSave.lastSalaryAdded || null
      ]
    );
    await databaseService.saveToStore();
    return profileToSave;
  }

  async hashPasscode(plain: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async validatePasscode(profileId: string, plain: string): Promise<boolean> {
    const res = await databaseService.query('SELECT passcode FROM profiles WHERE id = ?', [profileId]);
    if (!res.values || res.values.length === 0) return false;
    const storedHash = res.values[0].passcode;
    if (!storedHash) return true; // No passcode required
    const inputHash = await this.hashPasscode(plain);
    return storedHash === inputHash;
  }

  async getCurrentUser(): Promise<Profile | null> {
    return await settingsService.getSetting<Profile>('onyx_current_user');
  }

  async setCurrentUser(profile: Profile | null): Promise<void> {
    if (profile) {
      await settingsService.setSetting('onyx_current_user', profile);
      await settingsService.setSetting('is_onyx_authenticated', true);
    } else {
      await settingsService.removeSetting('onyx_current_user');
      await settingsService.removeSetting('is_onyx_authenticated');
    }
  }

  async setPasscodeEnabled(enabled: boolean): Promise<void> {
    await settingsService.setSetting('is_passcode_enabled', enabled);
  }

  async isPasscodeEnabled(): Promise<boolean> {
    const enabled = await settingsService.getSetting<boolean>('is_passcode_enabled');
    return enabled !== false; // Default to true
  }
}

export const profileService = new ProfileService();
