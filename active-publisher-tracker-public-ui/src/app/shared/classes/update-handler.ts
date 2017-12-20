import { Update } from './update';

export class UpdateHandler extends Update {

  public show: boolean;

  constructor(update: Update, show: boolean) {
    super(update.dataOwnerName, update.updateDate, update.categoryName, update.details);
    this.show = show;
  }

}
