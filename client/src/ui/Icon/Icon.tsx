import React, { useMemo } from 'react';
import clsx from 'clsx';

import { IconProps } from './types';

import icons from './icons';
import styles from './Icon.module.scss';


const Icon: React.FC<IconProps> = ({ className, name = 'logo', fill, ...props }) => {

  const IconComponent = useMemo(() => {
    return icons[name];
  }, [name]);

  if (!IconComponent) {
    console.warn(`this icon name doesn't exist: ${name}`); // eslint-disable-line no-console

    return <span />;
  }

  return (
    <IconComponent
      className={clsx(styles.icon, { fill: fill }, { pointer: props.onClick }, className)}
      {...props}
    />
  );
};

Icon.defaultProps = {
  name: 'logo',
  className: undefined,
  onClick: undefined,
  fill: false,
};

export default Icon;
