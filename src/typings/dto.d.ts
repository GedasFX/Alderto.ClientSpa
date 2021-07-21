export declare global {
  namespace Dto {
    namespace Guild {
      type Bank = {
        id: number;
        name: string;
        contents: BankItem[];
      };

      type BankItem = {
        id: number;
        name: string;
        value: number;
        quantity: number;
        description?: string;
        imageUrl?: string;
      };

      type Currency = {
        id: string;
        name: string;
        symbol: string;
        description?: string;
        timelyEnabled: boolean;
        timelyAmount: number;
        timelyInterval: number;
        isLocked: boolean;
      };

      type CurrencyTransaction = {
        id: number;
        date: string;
        senderId: string;
        recipientId: string;
        amount: number;
        isAward: boolean;
      };
    }
  }
}
