export default {
  // productionServerDomain: "https://realibi.kz",
  // productionSiteDomain: "https://oilan-classroom.com",
  productionServerDomain: "http://localhost:3030",
  productionSiteDomain: "http://localhost:3000",
  devSiteDomain: "http://localhost:3000",
  ftpDomain: "https://realibi.kz",
  localStorageKeys: {
    currentUserId: "currentUserId",
    authToken: "auth token",
    centerId: "center id",
    roleId: "role id",
    currentStudent: "current student",
  },
  checkPhoneMask: function (input, setterCallback) {
    const maskLength = 16;
    let validated = false;
    if (input.length <= maskLength) {
      let lastSymbol = input.charAt(input.length - 1);
      let lastSymbolIndex = input.length - 1;
      switch (lastSymbolIndex) {
        case 0:
          validated = lastSymbol === "8";
          if (validated) {
            input += "(";
          } else {
            input = input.slice(0, -1);
            input += "8(";
            validated = true;
          }
          break;
        case 1:
          validated = lastSymbol === "(";
          if (validated) {
            input += "7";
          }
          break;
        case 5:
          validated = lastSymbol === ")";
          if (validated) {
            input += "-";
          }
          break;
        case 2:
          validated = lastSymbol === "7";
          break;
        case 6:
        case 10:
        case 13:
          validated = lastSymbol === "-";
          if (!validated) {
            input = input.slice(0, -1);
            input += "-" + lastSymbol;
            this.checkPhoneMask(input, setterCallback);
          }
          break;
        case 4:
          validated = !isNaN(Number(lastSymbol));
          if (validated) {
            input += ")";
          }
          break;
        case 9:
        case 12:
          validated = !isNaN(Number(lastSymbol));
          if (validated) {
            input += "-";
          }
          break;
        case 3:
        case 7:
        case 8:
        case 11:
        case 14:
        case 15:
          validated = !isNaN(Number(lastSymbol));
          break;
      }
    } else {
      validated = false;
    }

    if (validated) {
      setterCallback(input);
    }
  },
};
