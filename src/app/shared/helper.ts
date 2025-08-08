import {Status} from './data';

export function getStatusPriority(status: Status) {
  switch (status.toLowerCase()) {
    case 'ingame':
      return 1; // Highest priority
    case 'online':
      return 2; // Mid priority
    case 'offline':
      return 3; // Lowest priority
    default:
      return 4; // Unknown status, lowest priority
  }
}
