export declare global {
  namespace App {
    type AccessLevel = 0 | 1 | 2 | 3;

    type NewsPost = {
      authorUsername: string;
      authorAvatarId: string;
      createdAt: string;
      contents: string;
    };

    type UserProfile = {
      id: string;
      guilds: UserProfileGuild[];
    };

    type UserProfileGuild = {
      id: string;
      name: string;
      icon?: string;
    };

    type ErrorResponse = {
      message: string;
    };

    type ErrorState = {
      statusCode: number;
    };
  }
}
