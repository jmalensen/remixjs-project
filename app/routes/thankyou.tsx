import { MetaFunction, json, LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { useTranslation } from "react-i18next";

import { soapRequest, SoapRequestParams, SoapResponse } from 'app/services/soapService';


export const meta: MetaFunction = () => {
  return [
    { title: "RGDQ" },
    { name: "description", content: "Thank you RGDQ!" },
  ];
};


export const loader: LoaderFunction = async ({ request }) => {

  // Parse query parameters from the request URL
  const params = new URLSearchParams(request.url.split("?")[1]);

  // Retrieve the form data from query parameters
  const customerNumber = params.get("customerNumber");
  const fullname = params.get("fullname");

  console.log(customerNumber, fullname);

  try {
    // Make SOAP request with appropriate parameters
    const params: SoapRequestParams = { ComputerName: import.meta.env.VITE_COMPUTER_NAME, CustomerNumber: customerNumber };
    const data: SoapResponse = await soapRequest(params);
    console.log(data);
    
    return json(data);
  } catch (error) {
    // Handle errors
    // console.error('SOAP request failed:', error);
    console.error('SOAP request failed:');
    return json({ error: 'Failed to fetch data from SOAP service' }, { status: 500 });
  }
};


// The page itself
export default function Thankyou() {

  // Translation part
  const { t } = useTranslation();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="container">

        <main className="rgdq-content">
          <div className="rgdq-thank">
            <h2>{t("thank_you")}</h2>
            <Link className="rgdq-submit" to="/">{t("back_home")}</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
