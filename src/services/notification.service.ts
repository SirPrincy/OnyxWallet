import { LocalNotifications } from '@capacitor/local-notifications';
import { Liability } from '../types';

export class NotificationService {
  async requestPermissions() {
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }
  }

  async scheduleLiabilityReminder(liability: Liability) {
    await this.requestPermissions();

    // Cancel existing notifications for this liability to avoid duplicates
    await this.cancelLiabilityReminders(liability.id);

    const dueDate = new Date(liability.dueDate);

    // Schedule for 24h before
    const dayBefore = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
    dayBefore.setHours(9, 0, 0, 0); // 9:00 AM

    if (dayBefore > new Date()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Échéance de dette demain',
            body: `N'oubliez pas de payer ${liability.monthlyPayment} pour "${liability.name}".`,
            id: this.generateNotificationId(liability.id, 'dayBefore'),
            schedule: { at: dayBefore },
            extra: { liabilityId: liability.id }
          }
        ]
      });
    }

    // Schedule for the day of
    const dayOf = new Date(dueDate);
    dayOf.setHours(9, 0, 0, 0); // 9:00 AM

    if (dayOf > new Date()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Échéance de dette aujourd\'hui',
            body: `Votre paiement de ${liability.monthlyPayment} pour "${liability.name}" est dû aujourd'hui.`,
            id: this.generateNotificationId(liability.id, 'dayOf'),
            schedule: { at: dayOf },
            extra: { liabilityId: liability.id }
          }
        ]
      });
    }
  }

  async cancelLiabilityReminders(liabilityId: string) {
    await LocalNotifications.cancel({
      notifications: [
        { id: this.generateNotificationId(liabilityId, 'dayBefore') },
        { id: this.generateNotificationId(liabilityId, 'dayOf') }
      ]
    });
  }

  private generateNotificationId(liabilityId: string, type: 'dayBefore' | 'dayOf'): number {
    // Generate a consistent numeric ID from the string UUID
    let hash = 0;
    const str = liabilityId + type;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}

export const notificationService = new NotificationService();
