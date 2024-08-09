export interface IconProps {
  name: string
  style?: 'outlined'
}

export const mediaIconMapping = {
  youtube: 'https://www.youtube.com/s/desktop/ef8ce500/img/favicon_144x144.png',
  telegram: 'https://telegram.org/img/t_logo.png',
  'ko-fi': 'https://storage.ko-fi.com/cdn/nav-logo-stroke.png'
}

export interface MediaIconProps extends IconProps {
  name: keyof typeof mediaIconMapping
}
