
function userRepo (User) {
  const users = [
    new User({
      id: 'f92fefd1-4059-447b-89c6-a7e2482f7a5f',
      lastName: 'Dumbledore',
      firstName: 'Albus',
      birthDate: new Date('1950-01-01'),
      phone: '+33654543456',
      address: 'bureau du directeur,chateau de poudlard',
      email: 'albus@mail.com'
    }),
    new User({
      id: 'c5e0357f-2eb7-4180-84e7-5c8efeab2c83',
      lastName: 'Potter',
      firstName: 'Harry',
      birthDate: new Date('1980-01-01'),
      phone: '+33654543456',
      address: 'lit numéro 2, dortoir des garçons, griffondor, chateau de poudlard',
      email: 'harry@mail.com'
    })
  ]

  const getAll = () => {
    return users
  }

  const getById = (id) => {
    return users.find(user => user.id === id)
  }

  const add = (user) => {
    users.push(user)
    return user
  }

  const update = (user) => {
    const userIndexToReplace = users.findIndex((b) => b.id === user.id)

    if (userIndexToReplace === -1) {
      return null
    }
    users[userIndexToReplace] = user
    return user
  }

  const del = (id) => {
    const userIndexToDelete = users.findIndex((b) => b.id === id)

    if (userIndexToDelete === -1) {
      return null
    }
    return users.splice(userIndexToDelete, 1)[0]
  }

  return {
    getAll,
    getById,
    add,
    update,
    del
  }
}

export default userRepo
