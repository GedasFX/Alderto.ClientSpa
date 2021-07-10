export declare global {
  namespace App {
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
  }
}
