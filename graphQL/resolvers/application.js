const Application = require("../../models/application");
const User = require("../../models/user");
const fetch = require("node-fetch");
var ObjectId = require("mongoose").Types.ObjectId;
var async = require("async");

saveApprovedApplication = (payload) => {
  let data = {
    revisionAuthor: "Admin",
    name: payload.profile_name,
    bio: payload.bio,
    channel: payload.category,
    subChannel: payload.profession,
    email: payload.email,
    willing_to_travel: false,
    title: payload.profile_tagline,
    _embedded: {
      photosTout: [...payload.image_sl],
    },
  };

  return fetch("https://stg-ad-api.aws.conde.io/contributors", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
};

module.exports = {
  // its a object having all the resolver
  fetchApplication: ({ id }) => {
    console.log("id", id);
    return new Promise((resolve, reject) => {
      Application.findOne({ user: new ObjectId(id) }, (err, application) => {
        if (err) reject(err);
        else {
          console.log(application);
          if (application && application._doc.cop_id) {
            //Call to fetch approved data set if copid is present
            fetch(
              `https://stg-ad-api.aws.conde.io/contributors/${application._doc.cop_id}`
            )
              .then((res) => res.json())
              .then((json) => {
                console.log(json);
                resolve({
                  profile_name: json["name"],
                  company_name: json["bio"],
                  category: json["channel"],
                  profession: json["subChannel"],
                  email: json["email"],
                  website: json["socialMedia"].join(","),
                  willing_to_travel: false,
                  profile_tagline: json["title"],
                  bio: json["bio"],
                  image_sl: json["_embedded"].photosTout,
                  phone_number: "1234567891",
                  social_media_profile: "ad/twitter.com",
                  application_status: "approved",
                });
              });
          } else {
            resolve(application);
          }
        }
      });
    });
  },
  fetchAllApplications: () => {
    return new Promise((resolve, reject) => {
      let applicationList = [];
      User.find((err, users) => {
        if (err) reject(err);
        if (users) {
           async.eachSeries(
            users,
            function (user, cb) {
              Application.findOne(
                {
                  user: user._id,
                },
                (err, application) => {
                  if (err) cb(err);
                  if (application) {
                    (async () => {
                      if (
                        !application.cop_id ||
                        application.application_status.status_type != "approved"
                      ) {
                        let appObj = {
                          user,
                          application,
                        };
                        applicationList.push(appObj);
                      } else {
                        //Call to fetch approved data set if copid is present

                        let app = await fetch(
                          `https://stg-ad-api.aws.conde.io/contributors/${application.cop_id}`
                        )
                          .then((res) => res.json())
                          .then((json) => {
                            let appObj = {
                              user,
                              application: {
                                user: user._id,
                                profile_name: json["name"],
                                company_name: json["bio"],
                                category: json["channel"],
                                profession: json["subChannel"],
                                email: json["email"],
                                website: json["socialMedia"].join(","),
                                willing_to_travel: false,
                                profile_tagline: json["title"],
                                bio: json["bio"],
                                image_sl: json["_embedded"].photosTout,
                                phone_number: "1234567891",
                                social_media_profile: "ad/twitter.com",
                                application_status: {
                                  status_type: "approved",
                                },
                              },
                            };
                            return appObj;
                          });                         
                        applicationList.push(app);
                      }
                      cb();
                    })();
                  }else{
                    cb()
                  }
                }
              );
            },
            function (err) {
              console.log("applicationList###", applicationList);
              if (err) reject(err);
              else resolve(applicationList);
            }
          );
        }
      });
    });
  },

  // its a object having all the resolver
  createApplication: (args) => {
    const application = new Application({
      // user: args.applicationInput.user,
      profile_name: args.applicationInput.profile_name,
      company_name: args.applicationInput.company_name,
      category: args.applicationInput.category,
      profession: args.applicationInput.profession,
      email: args.applicationInput.email,
      website: args.applicationInput.website,
      willing_to_travel: args.applicationInput.willing_to_travel,
      profile_tagline: args.applicationInput.profile_tagline,
      bio: args.applicationInput.bio,
      image_sl: args.applicationInput.image_sl,
      phone_number: args.applicationInput.phone_number,
      social_media_profile: args.applicationInput.social_media_profile,
    });
    return Application.findOneAndUpdate(
      { user: args.applicationInput.user },
      { ...args.applicationInput },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      }
    )
      .then((response) => {
        return { ...response._doc, _id: response.id };
      })
      .catch((error) => {
        throw error;
      });
  },
};
