export type UserRole = 'Manager' | 'Delegate' | 'Operator';
export type UserPlatformRole = 'admin' | 'security' | 'api';

export type Party = {
    status?: 'Pending' | 'Active';
    description: string;
    institutionId?: string;
    digitalAddress?: string;
    role?: UserRole;
    platformRole?: UserPlatformRole;
    partyId?: string;
    attributes?: Array<string>;
    image?:string; // TODO: to verify presence and content
    
  };
  