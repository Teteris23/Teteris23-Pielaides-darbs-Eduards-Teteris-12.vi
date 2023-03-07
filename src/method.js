// Importē bcrypt bibliotēku un UserModel modeli
const bcrypt = require("bcrypt");

const UserModel = require("./userModel");

// Definē UserProvider klasi, kas nodrošina funkcijas lietotāju autentifikācijai
class UserProvider {
  // Funkcija, kas izveido jaunu lietotāju
  static async signUp(name, password) {
    try {
      // Izveido paroles skaitļu maiņu izmantojot bcrypt hash funkciju
      const hashPass = await bcrypt.hash(password, 10);
       // Izveido jaunu UserModel instance ar vārdu un paroli
      const create = new UserModel({ name, password: hashPass });
      // Saglabā lietotāja datus datubāzē un atgriež tos
      return await create.save();
    } catch (error) {
      throw error;
    }
  }
// Funkcija, kas pārbauda lietotāja datus un nodrošina pieslēgšanos sistēmai
  static async login(name, password) {
    try {
      // Atrodi lietotāju ar vārdu
      const user = await UserModel.findOne({ name });
      // Ja lietotājs nav atrasts, atgriez kļūdas paziņojumu
      if (!user) {
        return { error: "this user does not exist" };
      }
      // Salīdzini lietotāja ievadīto paroli ar paroli, kas glabājas datubāzē, izmantojot bcrypt salīdzināšanas funkciju
      const passwordMatch = await bcrypt.compare(password, user.password);
      // Ja paroles nesakrīt, atgriez kļūdas paziņojumu
      if (!passwordMatch) {
        return { error: "Invalid username or pass" };
      }
      // Ja lietotājs un parole ir pareizi, atgriez lietotāju
      return user;
    } catch (error) {
      throw error;
    }
  }
// Funkcija, kas pārbauda, vai lietotājs ar noteiktu vārdu jau eksistē
  static async checkUser(name) {
    try {
      // Atrodi lietotāju ar vārdu
      const checkUserData = await UserModel.findOne({ name });
      // Atgriez lietotāja datus
      return checkUserData;
      // ja eksistē, tad met kļūdu
    } catch (error) {
      throw error;
    }
  }
}
// Node.js moduļa eksports, kas satur funkcijas lietotāja autentifikācijai
module.exports = userAuth = {
  // Funkcija, kas reģistrē jaunu lietotāju
  signUp: async (req, res) => {
    try {
      const { name, password } = req.body;
      const user = await UserProvider.checkUser(name);
// Ja lietotājs jau eksistē datubāzē, tad tiek parādīts paziņojums ar alert logu un tiek pāradresēts uz reģistrācijas lapu
      if (user) {
        res.send(
          `<script>alert('A user with this email already exists'); window.location.href = 'signup';</script>`
        );
        // Ja lietotājs neeksistē, tad tiek veidots jauns lietotājs un tiek pāradresēts uz pieteikšanās lapu
      } else if (!user) {
        const newUser = await UserProvider.signUp(name, password);

        return res.render("login");
      }
    } catch (error) {
      throw error;
    }
  },
 // Funkcija, kas ļauj lietotājam pieteikties
  login: async (req, res) => {
    try {
      const { name, password } = req.body;
      const result = await UserProvider.login(name, password);
      // Ja pieteikšanās neizdodas, tad tiek parādīts paziņojums ar alert logu un tiek pāradresēts uz reģistrācijas lapu
      if (result.error) {
        return res.send(
          `<script>alert('${result.error}'); window.location.href = 'signup';</script>`
        );
      }
       // Ja pieteikšanās izdodas, tad tiek ielādēta lietotāja mājaslapa
      const { user } = result;
      res.render("home");
    } catch (error) {
      // Ja notiek kļūda, tad tiek atgriezts 401 statusa kods ar kļūdas ziņojumu
      res.status(401).send({ message: error.message });
    }
  },
};
