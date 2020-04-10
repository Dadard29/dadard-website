export default class Profile {
    constructor(pk, u, d, s) {
        this.ProfileKey = pk;
        this.DateCreated = d;
        this.Username = u;
        this.Silver = s;
    }

    ProfileKey;
    Username;
    DateCreated;
    Silver;
    Contact;
    RecoverBy;
    BeNotified;
}