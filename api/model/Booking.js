
export default class Booking {
  /**
   * Constructeur
   * @constructor
   *
   * @param {String}       id         - Identifiant de la location
   * @param {String}       rentDate   - Date de location
   * @param {String}       returnDate - Date de retour
   * @param {Book | Movie} item       - Elément loué
   * @param {User}         user       - Utilisateur qui loue l'élément
   */
  constructor ({ id, rentDate, returnDate, item, user }) {
    this.id = id
    this.rentDate = rentDate
    this.returnDate = returnDate
    this.item = item
    this.user = user
  }
}
