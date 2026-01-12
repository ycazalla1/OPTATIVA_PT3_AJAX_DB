export default class Item {
  constructor({ id, data, producte, stock, comentari }) {
    this.id = id;
    this.data = data;
    this.producte = producte;
    this.stock = parseInt(stock);
    this.comentari = comentari;
  }
}