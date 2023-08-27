export interface IUserDataInThirdPartyService {
  profileId: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  name: {
    givenName: string;
    familyName: string;
  };
  verified: boolean;
}
