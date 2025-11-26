/**
 * Represents a discovered Bluetooth fitness machine device.
 */
export interface DeviceDescriptor {
  /** Unique device identifier (platform-specific) */
  readonly deviceId: string;
  /** Human-readable device name */
  readonly name: string;
  /** Device MAC address or platform identifier */
  readonly address: string;
  /** Signal strength in dBm (optional) */
  readonly rssi?: number;
}

/**
 * Creates a DeviceDescriptor from discovery data.
 */
export function createDeviceDescriptor(params: {
  deviceId: string;
  name: string;
  address: string;
  rssi?: number;
}): DeviceDescriptor {
  const base = {
    deviceId: params.deviceId,
    name: params.name || 'Unknown Device',
    address: params.address,
  };

  if (params.rssi !== undefined) {
    return {...base, rssi: params.rssi};
  }

  return base;
}

/**
 * Gets a display name for the device.
 * Returns the name if available, otherwise a formatted address.
 */
export function getDeviceDisplayName(device: DeviceDescriptor): string {
  if (device.name && device.name !== 'Unknown Device') {
    return device.name;
  }
  // Format address as XX:XX:XX:XX:XX:XX if it looks like a MAC address
  if (device.address.length === 12 && /^[0-9A-Fa-f]+$/.test(device.address)) {
    return device.address.match(/.{2}/g)?.join(':') ?? device.address;
  }
  return device.address;
}

/**
 * Checks if two device descriptors refer to the same device.
 */
export function isSameDevice(
  a: DeviceDescriptor,
  b: DeviceDescriptor,
): boolean {
  return a.deviceId === b.deviceId;
}

/**
 * Sorts devices by signal strength (strongest first).
 */
export function sortDevicesBySignal(
  devices: readonly DeviceDescriptor[],
): DeviceDescriptor[] {
  return [...devices].sort((a, b) => {
    const rssiA = a.rssi ?? -100;
    const rssiB = b.rssi ?? -100;
    return rssiB - rssiA;
  });
}
