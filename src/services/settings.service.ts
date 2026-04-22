import { Preferences } from '@capacitor/preferences';

class SettingsService {
  async setSetting(key: string, value: any): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  }

  async getSetting<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key });
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value as unknown as T;
    }
  }

  async removeSetting(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  async clear(): Promise<void> {
    await Preferences.clear();
  }
}

export const settingsService = new SettingsService();
