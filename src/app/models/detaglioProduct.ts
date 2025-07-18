export class DetaglioProduct {
  id:Number;
  name: string;
  photoName: string;
  description: string;
  promotion: Number;
  selected: Number;
  available: Number;
  currentprice: Number;
  idCat: Number;

  constructor(
    id:Number,
    name: string,
    photoName: string,
    description: string,
    promotion: Number,
    selected: Number,
    available: Number,
    currentprice: Number,
    idCat: Number,

  ) {
    this.id=id;
    this.name=name;
    this.photoName=photoName;
    this.description=description;
    this.promotion=promotion;
    this.selected=selected;
    this.available=available;
    this.currentprice=currentprice;
    this.idCat = idCat;
    }
}
