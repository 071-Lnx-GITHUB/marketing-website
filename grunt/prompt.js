module.exports = {
  target: {
    options: {
      questions: [
        {
          config: 'marketingDistName', // set the tag to whatever is typed for this question
          type: 'input',
          default: 'website-stable', // default value if nothing is entered
          message: 'Name of release tag:'
        },
        {
          config: 'github-release.options.auth.user', // set the user to whatever is typed for this question
          type: 'input',
          message: 'GitHub username:'
        },
        {
          config: 'github-release.options.auth.password', // set the password to whatever is typed for this question
          type: 'password',
          message: 'GitHub password (or API/auth key password):'
        }
      ]
    }
  }
};
