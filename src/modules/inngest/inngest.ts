import { eventType, Inngest } from 'inngest'
import z from 'zod'
import { JamModel } from '../jams/model'
import { SettingsModel } from '../settings/model'

export const jamAnnouncementNotification = eventType('jam.notification.announcement', {
  schema: z.object({
    jam: JamModel.jamSchema,
    guild: SettingsModel.guildSettingsSchema,
  }),
})

export const jamReminderNotification = eventType('jam.notification.reminder', {
  schema: z.object({
    jam: JamModel.jamSchema,
    guild: SettingsModel.guildSettingsSchema,
  }),
})

export const jamRecapNotification = eventType('jam.notification.recap', {
  schema: z.object({
    jam: JamModel.jamSchema,
    guild: SettingsModel.guildSettingsSchema,
  }),
})

export const inngest = new Inngest({
  id: 'art-jam',
})
