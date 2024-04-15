import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";

import { json } from "@remix-run/node";

import "./styles/main.scss"; // Import compiled CSS file
// scripts "build:scss": "sass ./app/styles/main.scss ./build/client/assets/main.css"

import favicon32 from "app/images/fliklogga-32.png";
import favicon from "app/images/fliklogga.png";

import logo from "app/images/casino-logo-1.svg";
import englishflag from "app/images/english-flag.svg";
import swedishflag from "app/images/swedish-flag.svg";

// Translation imports
import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";

export async function loader({ request }: LoaderArgs) {
	const locale = await i18next.getLocale(request);
	return json({ locale });
}

export const handle = {
	// In the handle export, we can add a i18n key with namespaces our route
	// will need to load. This key can be a single string or an array of strings.
	// TIP: In most cases, you should set this to your defaultNS from your i18n config
	// or if you did not set one, set it to the i18next default namespace "translation"
	i18n: "common",
};

export function Layout({ children }: { children: React.ReactNode }) {
  // Get the locale from the loader
	const { locale } = useLoaderData<typeof loader>();
	const { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
	// detected by the loader, this way, when we do something to change the
	// language, this locale will change and i18next will load the correct
	// translation files
	useChangeLanguage(locale);

  const changeLanguage = (language:string) => {
    i18n.changeLanguage(language, (error) => {
      // console.log(error);
      // alert(language)
    });
  };

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon32} sizes="32x32"></link>
        <link rel="icon" href={favicon} sizes="192x192"></link>
        <link rel="apple-touch-icon" href={favicon}></link>
        <meta name="msapplication-TileImage" content={favicon}></meta>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container">
          <div className="rgdq-top-page">
            <div className="">
              <img className="rgdq-logo" src={logo} alt="Logo" />
            </div>
            <div className="rgdq-lang-select">
              {i18n.language == "se" ? <p className="button-text">
                <span className="noselect">
                  <img className="rgdq-language-selector" data-lang="en" src={englishflag} alt="English flag" onClick={() => changeLanguage("en")} />
                </span>
              </p> : null }
              {i18n.language == "en" ? <p className="button-text">
                <span className="noselect">
                  <img className="rgdq-language-selector" data-lang="en" src={swedishflag} alt="Swedish flag" onClick={() => changeLanguage("se")} />
                </span>
              </p> : null }
            </div>
          </div>
        </div>

        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
