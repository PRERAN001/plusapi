const axios = require("axios");
const History = require("../models/History");
const Environment = require("../models/Variable");

console.log("Environment:");
console.log(Environment);

function resolveVariables(data, variables) {
    if (data === null || data === undefined) {
        return data;
    }
    if (typeof data === "string") {
        return data.replace(/{{(.*?)}}/g, (_, key) => {
            const value = variables[key.trim()];

            return value !== undefined ? String(value) : "";
        });
    }
    if (Array.isArray(data)) {
        return data.map((item) => resolveVariables(item, variables));
    }
    if (typeof data === "object") {
        const resolved = {};

        for (const key in data) {
            resolved[key] = resolveVariables(data[key], variables);
        }

        return resolved;
    }
    return data;
}

exports.executeRequestService = async ({
    method,
    url,
    headers = {},
    params = {},
    body = {},
    environmentId,
}) => {

    const start = Date.now();

    try {

        
        let variables = {};

        if (environmentId) {

            const environment = await Environment.findById(environmentId);
            console.log("environment",environment);

            if (environment) {
                variables = Object.fromEntries(environment.variables);
            }

        } else {

            const environment = await Environment.findOne();

            if (environment) {
                variables = Object.fromEntries(environment.variables);
            }

        }

       
        url = resolveVariables(url, variables);
        console.log("urlssssssssss",url)


        headers = resolveVariables(headers, variables);

        params = resolveVariables(params, variables);

        body = resolveVariables(body, variables);

      
        const response = await axios({

            method,

            url,

            headers,

            params,

            data: body,

            timeout: 10000,

            validateStatus: () => true,

        });
        console.log("backend reponseeeeee",response)

        const end = Date.now();


        const history = await History.create({

            method,

            url,

            headers,

            params,

            body,

            response: response.data,

            responseHeaders: response.headers,

            status: response.status,

            responseTime: end - start,

            responseSize: JSON.stringify(response.data).length,

            success: response.status < 400,

        });

        return {

            success: true,

            historyId: history._id,

            status: response.status,

            headers: response.headers,

            data: response.data,

            time: end - start,

            size: JSON.stringify(response.data).length,

        };

    } catch (error) {

        const end = Date.now();

        return {

            success: false,

            message: error.message,

            status: error.response?.status || 500,

            headers: error.response?.headers || {},

            data: error.response?.data || {},

            time: end - start,

        };

    }

};