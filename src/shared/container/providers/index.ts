import { container } from "tsyringe";

import { DayjsDateProvider } from "./DateProvider/implementations/DayjsDateProvider";
import { IDateProvider } from "./DateProvider/IDateProvider";

import { IMailProvider } from "./MailProvider/IMailProvider";
import { EtherealMailProvider } from "./MailProvider/implementations/EtherealMailProvider";

import { IAppleOAuthProvider, IGoogleOAuthProvider } from "./OAuthProvider/IOAuthProvider";
import { GoogleOAuthProvider } from "./OAuthProvider/implementations/GoogleOAuthProvider";
import { AppleOAuthProvider } from "./OAuthProvider/implementations/AppleOAuthProvider";

import { IGoogleRecaptchaProvider } from "./RecaptchaProvider/IRecaptchaProvider";
import { GoogleRecaptchaProvider } from "./RecaptchaProvider/implementations/GoogleRecaptchaProvider";

import { ISocketProvider } from "./SocketProvider/ISocketProvider";
import { SocketProvider } from "./SocketProvider/implementations/SocketProvider";

container.registerSingleton<IDateProvider>(
    "DayjsDateProvider",
    DayjsDateProvider
);

container.registerSingleton<IGoogleOAuthProvider>(
    "GoogleOAuthProvider",
    GoogleOAuthProvider
);

container.registerSingleton<IAppleOAuthProvider>(
    "AppleOAuthProvider",
    AppleOAuthProvider
);

container.registerSingleton<IGoogleRecaptchaProvider>(
    "GoogleRecaptchaProvider",
    GoogleRecaptchaProvider
);

// aqui usa o register instance pois precisa criar o client antes de chamar o send mail
container.registerInstance<IMailProvider>(
    "EtherealMailProvider",
    new EtherealMailProvider()
);

container.registerSingleton<ISocketProvider>(
    "SocketProvider",
    SocketProvider
);
