import messages from '../../messages/uk'

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages
  }
}
