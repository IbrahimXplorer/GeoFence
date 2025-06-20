import notifee, {
    AndroidImportance,
    AndroidVisibility,
    AuthorizationStatus,
    TimestampTrigger,
    TriggerType
} from '@notifee/react-native';
import { Platform } from 'react-native';

export const requestNotificationPermission = async () => {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    console.log('✅ Notification permission granted:', settings);
  } else {
    console.warn('🚫 Notification permission not granted');
  }
};

export const createDefaultNotificationChannel = async (): Promise<string> => {
  if (Platform.OS === 'android') {
    return await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });
  }
  return 'default';
};

export const showLocalNotification = async (
  title: string,
  body: string
): Promise<void> => {
  const channelId = await createDefaultNotificationChannel();

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
      smallIcon: 'ic_launcher', 
    },
  });
};

export const cancelAllNotifications = async (): Promise<void> => {
  await notifee.cancelAllNotifications();
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  timestamp: number 
): Promise<void> => {
  const channelId = await createDefaultNotificationChannel();

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp,
  };

  await notifee.createTriggerNotification(
    {
      title,
      body,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    },
    trigger
  );
};
