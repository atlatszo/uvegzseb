import { RankedData } from './ranked-data';

export class RankedDataResponse {

  constructor(public ranking: Array<RankedData>, public totalCount: number) { }

}
