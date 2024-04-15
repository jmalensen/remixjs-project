import { MetaFunction, json, LoaderFunction, redirect } from "@remix-run/node";

import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";

import { useTranslation } from "react-i18next";


export const meta: MetaFunction = () => {
  return [
    { title: "RGDQ" },
    { name: "description", content: "Welcome to RGDQ!" },
  ];
};


export const loader: LoaderFunction = async () => {

  console.log("Normal load");
  try {
    // Contact API endpoint
    const response1 = await fetch('https://catfact.ninja/fact');
    
    if (!response1.ok) {
      throw new Error('Failed to fetch data from API');
    }
    
    // Parse response data (if JSON)
    const data1 = await response1.json();

    console.log('LoaderFunction- ', data1);
    
    return data1;
  } catch (error) {
    // Handle error
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data from API');
  }
};


// Validation of the submitted form
export async function action({ request }: ActionFunctionArgs) {

  const formData = await request.formData();
  const customerNumber = String(formData.get("customerNumber"));
  const fullname = String(formData.get("fullname"));

  const errors = {};

  if (!customerNumber.includes("1")) {
    errors.customerNumber = "Invalid customer number";
  }

  if (fullname.length < 12) {
    errors.fullname = "The name should be at least 12 characters";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  // Redirect to thank you page if validation is successful with form data as query parameters
  const queryString = `?customerNumber=${encodeURIComponent(customerNumber)}&fullname=${encodeURIComponent(fullname)}`;
  return redirect(`/thankyou${queryString}`);
}


// The page itself
export default function Index() {

  // Translation part
  const { t } = useTranslation();

  // Data from API
  const loaderData = useLoaderData<typeof loader>();

  // Form validation
  const actionData = useActionData<typeof action>();

  if (!loaderData) {
    // Handle loading state
    return <div>{t("loading")}...</div>;
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="container">

        <main className="rgdq-content">
          <h1>{t("title")}</h1>
          <p>{loaderData.fact}</p>

          <Form method="post">
            <div className="rgdq-input-container">
              <input className="rgdq-input" type="text" name="customerNumber" placeholder={t("customer_number")} />
              {actionData?.errors?.customerNumber ? (
                <em>{actionData?.errors.customerNumber}</em>
              ) : null}
            </div>

            <div className="rgdq-input-container">
              <input className="rgdq-input" type="text" name="fullname" placeholder={t("fullname")} />
              {actionData?.errors?.fullname ? (
                <em>{actionData?.errors.fullname}</em>
              ) : null}
            </div>

            <div className="rgdq-input-container">
              <p>
                {t("have_you_set_budget")}
              </p>
              <p>
                <label className="rgdq-container">
                  <span className="rgdq-label">{t("yes")}</span>
                  <input type="radio" defaultChecked name="setbudget" value="1" />
                  <span className="rgdq-checkmark"></span>
                </label>

                <label className="rgdq-container">
                  <span className="rgdq-label">{t("no")}</span>
                  <input type="radio" name="setbudget" value="0" />
                  <span className="rgdq-checkmark"></span>
                </label>
              </p>
            </div>

            <div className="rgdq-input-container">
              <p>
                {t("for_what_purpose_you_visit_casino")}
              </p>
              <textarea className="rgdq-textarea"></textarea>
            </div>

            <div className="rgdq-input-container">
              <p>
                {t("do_you_know_our_tips")}
              </p>
              <p>
                <label className="rgdq-container">
                  <span className="rgdq-label">{t("yes")}</span>
                  <input type="radio" defaultChecked name="tips" value="1" />
                  <span className="rgdq-checkmark"></span>
                </label>

                <label className="rgdq-container">
                  <span className="rgdq-label">{t("no")}</span>
                  <input type="radio" name="tips" value="0" />
                  <span className="rgdq-checkmark"></span>
                </label>
              </p>
            </div>

            <div className="rgdq-contain-actions">
              <input className="rgdq-submit" name="rgdq-submit" type="submit" value={t("continue")} />
            </div>

          </Form>
        </main>
      </div>
    </div>
  );
}
