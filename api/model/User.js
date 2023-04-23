
export default class User {
  /**
   * Constructeur
   * @constructor
   *
   * @param {String} id        - Identifiant de l'utilisateur
   * @param {String} lastName  - Nom de l'utilisateur
   * @param {String} firstName - Prénom de l'utilisateur
   * @param {Date}   birthDate - Date de naissance
   * @param {String} address   - Adresse postale
   * @param {String} phone     - Téléphone (mobile ou fixe)
   * @param {String} email     - Email
   */
  constructor ({ id, lastName, firstName, birthDate, address, phone, email }) {
    this.id = id
    this.lastName = lastName
    this.firstName = firstName
    this.birthDate = birthDate
    this.address = address
    this.phone = phone
    this.email = email
  }
}
