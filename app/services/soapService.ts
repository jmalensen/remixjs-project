import soap, { Client } from 'soap';

// Define the URL of the SOAP service


const url = (import.meta.env.PROD) ? import.meta.env.VITE_WSDL_URL : import.meta.env.VITE_WSDL_URL_UAT;




// Define the types for SOAP response and request parameters if necessary

// Define the interface for SOAP service response
export interface SoapResponse {
  // Define the structure of your SOAP response

  // firstName: string;
  // lastName: string;
  // age: number;
  // Add other properties as needed
}

// Define the interface for SOAP service request parameters
export interface SoapRequestParams {
  // Define the structure of your SOAP request parameters

  // customerId: string;
  // Add other parameters as needed
}


// Function to make SOAP request
// export async function soapRequest(params: SoapRequestParams): Promise<SoapResponse> {
//   try {
//     const client: Client = await soap.createClientAsync(url);
//     console.log('SOAP client created successfully');
//     console.log('Available SOAP methods:', Object.keys(client)); // Log available methods
    
//     const result: SoapResponse = await client.GetNationalities();
//     console.log('SOAP request successful', result);
//     return result;
//   } catch (error) {
//     console.error('SOAP request failed:', error);
//     // throw new Error('SOAP request failed: ' + error.message);
//     throw new Error('SOAP request failed: ');
//   }
// }


// Function to make SOAP request
export async function soapRequest(params: any): Promise<any> {
// export function soapRequest(params: any): Promise<any> {

  try {
    const client: Client = await soap.createClientAsync(url);
    console.log('Service - SOAP client created successfully');
    console.log('Service - Available SOAP methods:', Object.keys(client), params); // Log available methods
    
    // Adjust the SOAP function call to return a promise
    const result = await new Promise<any>((resolve, reject) => {
      client.GetNationalities(params, (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    // const result = soap.createClient(`${url}`, (err, client) => {

    //   // here
    //   client.setEndpoint(url);

    //   console.log('Available SOAP methods:', Object.keys(client)); // Log available methods
  
    //   client.GetCustomersInCasino(params, (err, result) => {
    //       if(err){
    //         throw err;
    //       }
    //       console.log(result);
    //   });
  
    // });

    console.log('Service - SOAP request successful');
    return result;
  } catch (error) {
    console.error('Service - SOAP request failed:', error);
    throw new Error('Service - SOAP request failed: ' + error);
  }
}