import { readFileSync } from "fs";

const packageFile = readFileSync("./package.json");
const packageJson = JSON.parse(packageFile);
// Check if the user has configured the package to use conventional commits.

let isConventional = false;
if (packageJson.config) isConventional = packageJson.config["commitizenEmoji"]?.conventional;

// Regex for default and conventional commits.
const RE_DEFAULT_COMMIT =
  /^(:[a-zA-Z0-9_]+:|(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]))\s(?<emoji>\w*?)(\((?<scope>[a-z].*?)\))?:\s[a-z].*$/gm;
const RE_CONVENTIONAL_COMMIT =
  /^^(?<type>\w+)(?:\((?<scope>\w+)\))?\s(?<emoji>:.*:|(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]))\s.*$/gm;

export default {
  rules: {
    commitizenEmoji: [2, "always"],
  },
  plugins: [
    {
      rules: {
        commitizenEmoji: ({ raw }) => {
          if (isConventional) {
            const isValid = RE_CONVENTIONAL_COMMIT.test(raw);
            const message = "Your commit message should follow conventional commit format.";
            return [isValid, message];
          } else {
            const isValid = RE_DEFAULT_COMMIT.test(raw);
            const message = `Your commit message should be: <emoji> (<scope>)?: <subject>, where
subject is lowercase`;
            return [isValid, message];
          }
        },
      },
    },
  ],
};
