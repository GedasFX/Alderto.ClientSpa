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
    }
  }
}
