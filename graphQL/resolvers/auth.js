const atob = require('atob');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

function decodeCookie(cookie) {
    try {
        const [, payload] = cookie.split('.');
        return JSON.parse(atob(payload));
    } catch (e) {
        return {
            userName: '',
            exp: 0,
            iat: 0
        };
    }
}

const adPro = (payload) => {
    const payEntPass = decodeCookie(payload);
    return (payEntPass.scopes && payEntPass.scopes.map(subscrption => {
        if (subscrption === 'ad-pro') {
            return true;
        }
    })
    )
};

const cnToken = (payload) => {
    const cnTokenDetails = decodeCookie(payload);
    if (cnTokenDetails && cnTokenDetails.email.length) {
        return { ...cnTokenDetails };
    }
    else {
        return false;
    }
}

const jwtToken = (payload, type, additional) => {
    if(type === "sign") {
        return jwt.sign(payload, 'AD-Directory', additional);
    } else if(type === "verify") {
        return jwt.verify(payload, 'AD-Directory');
    }
}
module.exports = {
    // its a object having all the resolver
    validate: (args) => {
        const tokenDetails = decodeCookie(args.validateInput.token);
        console.log("Token Details", tokenDetails);
        return { ...jwtToken(args.validateInput.token, 'verify'), ...tokenDetails, is_token_expired: true}
    },
    login: (args) => {
        if (args.loginInput.pay_ent_pass && adPro(args.loginInput.pay_ent_pass)[0]) {
            if (args.loginInput.pay_ent_pass && cnToken(args.loginInput.cn_token)) {
                return User.findOne({ email: cnToken(args.loginInput.cn_token).email })
                    .then((user) => {
                        const additionalData = {
                            expiresIn: 86400,
                        };
                        if (user) {
                            return { ...user._doc, _id: user.id, token: jwtToken({ ...user._doc }, "sign", additionalData), status: true }
                        }
                        const createUser = new User({
                            uuid: "8f9dbfrue4fb4885bg",
                            email: cnToken(args.loginInput.cn_token).email,
                            scope: ["ad-pro"]
                        })
                        return createUser.save()
                            .then((response) => {
                                console.log("response", response._doc);
                                return { ...response._doc, _id: response.id, token: jwtToken({ ...response._doc }, "sign", additionalData), status: true }
                            })
                            .catch(err => {
                                throw err;
                            })
                    }).catch(err => {
                        throw err;
                    })
            } else {
                return {
                    token: "",
                    email: "",
                    status: false,
                    reason: "Not Logged-in"
                }
            }
        }
        else {
            return {
                token: "",
                email: "",
                status: false,
                reason: "Not AD-Pro Member"
            }
        }
    },
};