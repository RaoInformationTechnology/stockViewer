import config from './config';

// let config = new Config;

export default {

    /**
     * @param {string} historicalData display histoical data of selected company
    */
    displayHistoricalData: (historicalData) => {
        const url = config.getBaseUrl + "TIME_SERIES_DAILY_ADJUSTED&symbol=" + historicalData + config.getBaseUrlForKey;
        return fetch(url)
        .then((response) => response.json())
        .catch((err) => ({ status: 500, message: 'Internal Server Error' +err }));
    },

    /**
     * @param {object} intervalData selected interval value and get data of this 
     */
    selectInterval: (intervalData) => {
        if (intervalData.intervalValue == 'MONTHLY') {
            const url = config.getBaseUrl + "TIME_SERIES_MONTHLY&symbol=" + intervalData.symbol + "&name=apple&interval=5min" + config.getBaseUrlForKey;
            return fetch(url)
                .then((response) => response.json())
                .catch((err) => ({ status: 500, message: 'Internal Server Error' +err }));
        } else if (intervalData.intervalValue == 'WEEKLY') {
            const url = config.getBaseUrl + "TIME_SERIES_WEEKLY&symbol=" + intervalData.symbol + "&name=apple&interval=5min" + config.getBaseUrlForKey;
            return fetch(url)
                .then((response) => response.json())
                .catch({ status: 500, message: 'Internal Server Error' });
        } else {
            const url = config.getBaseUrl + "TIME_SERIES_INTRADAY&symbol=" + intervalData.symbol + "&name=apple&interval=" + intervalData.intervalValue + config.getBaseUrlForKey;
            return fetch(url)
                .then((response) => response.json())
                 .catch((err) => ({ status: 500, message: 'Internal Server Error' +err }));
        }
    },

    /**@param {string} companySymbol selected company symbol from dropdown and get data*/
    selectComparisonCompany: (companySymbol) => {
        const url = config.getBaseUrl + "TIME_SERIES_INTRADAY&symbol=" + companySymbol + "&name=apple&interval=5min" + config.getBaseUrlForKey;
        return fetch(url)
            .then((response) => response.json())
            .catch({ status: 500, message: 'Internal Server Error' });
    },

    /**
     * @param {object} firstSelectedCompany first company symbol and get data of this 
     */
    comparedCompanyData: (firstSelectedCompany) => {
        const url = config.getBaseUrl + "TIME_SERIES_INTRADAY&symbol=" + firstSelectedCompany + "&name=apple&interval=5min" + config.getBaseUrlForKey;
        return fetch(url)
            .then((response) => response.json())
            .catch({ status: 500, message: 'Internal Server Error' });
    },

    /**
     * @param {object} indicatorData selected indicator data and get data of indicator 
     */
    getSelectedIndicatorData: (indicatorData) => {
        const url = config.getBaseUrl + indicatorData.indicatorValue + "&symbol=" + indicatorData.indicatorValue + "&interval=monthly&time_period=10&series_type=open" + config.getBaseUrlForKey;
        return fetch(url)
            .then((response) => response.json())
            .catch({ status: 500, message: 'Internal Server Error' });
    },

    /**
     * @param {*} companySymbol selected comapny symbol when page load and get data of company symbol 
     */
    getApiData: (companySymbol) => {
        const url = config.getBaseUrl + "SYMBOL_SEARCH&keywords=" + companySymbol + config.getBaseUrlForKey;
        return fetch(url)
            .then((response) => response.json())
            .catch({ status: 500, message: 'Internal Server Error' });
    },

    /**
     * @param {string} companySymbol first company symbol of watchlist or selcted company symbol for display graph 
     */
    displaySelectedCompanyGraph: (companySymbol) => {
        const url = config.getBaseUrl + "TIME_SERIES_INTRADAY&symbol=" + companySymbol + "&name=apple&interval=5min" + config.getBaseUrlForKey;
        return fetch(url)
            .then((response) => response.json())
            .catch({ status: 500, message: 'Internal Server Error' });
    },
}

