import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../Firebase';
import ReactApexChart from 'react-apexcharts';
import swal from 'sweetalert';
import '../App.css';
import './Company-list.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import API from '../service';
import history from '../History';


const options = {
    chart: {
        stacked: false,
        zoom: {
            type: 'x',
            enabled: true
        },
        toolbar: {
            autoSelected: 'zoom'
        }
    },
    plotOptions: {
        line: {
            curve: 'smooth',
        }
    },
    dataLabels: {
        enabled: false
    },

    markers: {
        size: 0,
        style: 'full',
    },
    colors: ['#ff4d4d'],
    opacity: 0.4,
    title: {
        text: 'Stock Price Movement',
        align: 'left'
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
        },
    },
    yaxis: {
        min: 0,
        max: 250000,
        labels: {
            formatter: function (val) {
                return (val).toFixed(0);
            },
        },
        title: {
            text: 'Price'
        },
    },
    xaxis: {
        type: 'datetime',
    },
    tooltip: {
        shared: false,
        y: {
            formatter: function (val) {
                return (val / 1000).toFixed(0)
            }
        }
    }
}

const ranges = [
    {
        value: '1min',
        label: '1 min',
    },
    {
        value: '5min',
        label: '5 mins',
    },
    {
        value: '15min',
        label: '15 mins',
    },
    {
        value: '30min',
        label: '30 mins',
    },
    {
        value: '60min',
        label: '1 hour',
    }
];

const indicatorList = [
    {
        value: 'SMA',
        label: 'simple moving average (SMA)',
    },
    {
        value: 'EMA',
        label: ' Exponential moving average (EMA) '
    },
    {
        value: 'MACD',
        label: 'Moving average convergence / divergence (MACD)',
    },
    {
        value: 'MACDEXT',
        label: 'Moving average convergence / divergence'
    },
    {
        value: 'APO',
        label: 'Absolute price oscillator (APO)',
    },
    {
        value: 'RSI',
        label: 'Relative strength index (RSI)',
    },
    {
        value: 'ROC',
        label: ' Rate of change(ROC)'
    },
    {
        value: 'ROCR',
        label: 'Rate of change ratio (ROCR)'
    },
    {
        value: 'ADX',
        label: 'Average directional movement index (ADX) ',
    },
    {
        value: 'AROONOSC',
        label: ' Aroon oscillator (AROONOSC)'
    },
    {
        value: 'TRIX',
        label: 'Triple smooth exponential moving average (TRIX)',
    },
    {
        value: 'OBV',
        label: 'On balance volume (OBV) ',
    }
];

class Companylist extends Component {

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('company');
        this.unsubscribe = null;
        this.state = {
            user: [],
            array: [],
            searchResponse: [],
            results: [],
            companyData: [],
            query: '',
            value: '',
            searchValue: '',
            companySymbol: '',
            companyName: '',
            symbol: '',
            name: '',
            userEmail: '',
            grapharray: [],
            date: "",
            open: '',
            close: '',
            high: '',
            low: '',
            volume: '',
            indicatorObj: '',
            historicalArray: [],
            intervalArray: [],
            graphData: [],
            intervalData: [],
            firstSelectedCompanyArray: [],
            secondSelectedCompanyArray: [],
            indicatorDataArray: [],
            indicatorGraphData: [],
            comparisonOfVolume: [],
            historicalOpen: '',
            historicalClose: '',
            historicalHigh: '',
            historicalLow: '',
            historicalVolume: '',
            historicalAdjClose: '',
            values: '',
            firstCompany: '',
            selectedCompany: '',
            selectedInterval: '',
            intervalRange: '',
            clickCompanyName: '',
            clickCompanySymbol: '',
            firstSelectedCompany: '',
            isToggleOn: true,
            setOpen: false,
            modalOpen: false,
            isLoaded: false,
            isSearchClick: false,
            isOpenSearch: false,
            isOpenCompanyList: false,
            isSelectinterval: false,
            isGraphDisplay: false,
            isSelectHistorical: false,
            isIntervalValue: false,
            isIndicatorGraph: false,
            isComparedCompany: false,
            checkAlreadyAddOrNot: false
        };
        this.addCompanytoWatchlist = this.addCompanytoWatchlist.bind(this);
        this.getSearchValue = this.getSearchValue.bind(this);
        this.submitSearchValue = this.submitSearchValue.bind(this);
        this.getCompany = this.getCompany.bind(this);
        this.displaySelectedCompanyGraph = this.displaySelectedCompanyGraph.bind(this);
        this.openSearchbar = this.openSearchbar.bind(this);
        this.displayCompanyList = this.displayCompanyList.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        this.getCompany();
        this.getDate();
        // this.unsubscribe = this.ref.onSnapshot(this.getCompany);
    }

	/**
     * @param {object} event get name or symbol of search company
     */
    getSearchValue(event) {
        this.setState({ value: event.target.value, searchValue: event.target.value });
    }

	/**
     * @param {object} event validation of search button 
     */
    submitSearchValue(event) {
        this.setState({ value: '', isLoaded: false });
        /**validation for search input */
        if (!this.state.value) {
            swal("Please, Enter value", "", "info");
        } else {
            console.log("name:", this.state.value);
            console.log("searchValue", this.state.searchValue);
            event.preventDefault();
            this.getApiData();
            this.setState({ value: '' });
        }
    }

	/**
     * @param {object} data call add company function and get name and symbol of add company 
     */
    addCompanytoWatchlist(data) {
        console.log('data: ', data);
        this.setState({ companySymbol: data['1. symbol'], companyName: data['2. name'] });
        this.getApiData();
        this.addComapny();
    }

	/**
	 * @param {string} companySymbol wise display historical data table 
	 */
    displayHistoricalData(companySymbol) {
        const historicalData = companySymbol
        console.log("historical data:", historicalData);
        console.log("symbol of selected company==============>", companySymbol);
        console.log("type:", typeof companySymbol)
        this.setState({ isSelectHistorical: true, isSelectinterval: false, historicalArray: [], isComparedCompany: false })
        API.displayHistoricalData(historicalData)
            .then((res) => {
                try {
                    const originalObject = res['Time Series (Daily)'];
                    console.log('originalObject: ', originalObject);
                    if (originalObject) {
                        for (let key in originalObject) {
                            this.state.historicalArray.push({
                                date: key,
                                open: originalObject[key]['1. open'],
                                high: originalObject[key]['2. high'],
                                low: originalObject[key]['3. low'],
                                close: originalObject[key]['4. close'],
                                adjclose: originalObject[key]['5. adjusted close'],
                                volume: originalObject[key]['6. volume']
                            })
                        }
                        console.log("historicalArray==========>", this.state.historicalArray);
                        this.setState({ isSelectHistorical: true })
                    } else {
                        swal('Internal Server Error');
                    }
                } catch (err) {
                    swal('Internal Server Error');
                }
            }).catch((err) => {
                swal('Internal Server Error')
            })
    }

    /** selected symbol to add in watchlist */
    addComapny() {
        if (this.state.companySymbol) {
            console.log("addCompany2:", this.state.companySymbol);
            return (
                swal({
                    title: this.state.companySymbol,
                    text: this.state.companyName,
                    icon: "success",
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        this.checkIfalreadyAddOrNot(this.state.companyName)
                    }
                })
            )
        }
    }

	/**
	 * @param {string} companyName already add or not 
	 */
    checkIfalreadyAddOrNot = (companyName) => {
        this.state.isSearchClick = false;
        this.state.isOpenCompanyList = false;
        console.log('getcompany:');
        localStorage.getItem('email1')
        const email = localStorage.email1;
        console.log(companyName)
        let companyData = [];
        /** it's check selected company already added into database or not */
        firebase.firestore().collection("company").where("name", "==", companyName).where("email", "==", email)
            .get()
            .then(function (querySnapshot) {
                console.log("querySnapshot", querySnapshot)
                querySnapshot.forEach(function (doc) {
                    const { name, email } = doc.data();
                    console.log("data:", doc.data())
                    companyData.push({
                        key: doc.id,
                        doc,
                        name,
                        email,
                    });
                });
                console.log("data1:", companyData.length);
                if (companyData.length) {
                    console.log('found data', companyData);
                    swal("Already added!", "", "info")
                        .then((willDelete) => {
                            if (willDelete) {
                                window.location.reload();
                            }
                        }).catch((err) => {
                            console.log("hey error:", err);
                            swal('Internal Server Error');
                        })
                } else {
                    console.log("new company");
                    addCompanyToDatabase()
                }
            }).catch((err) => {
                swal('Internal Server Error');
            })

        /** Add comapny to database */
        const addCompanyToDatabase = () => {
            localStorage.getItem('email1')
            let email = localStorage.email1;
            console.log("isLoaded before:", this.state.isLoaded);
            this.ref.add({
                symbol: this.state.companySymbol,
                name: this.state.companyName,
                email: email
            }).then((docRef) => {
                window.location.reload();
            }).catch((error) => {
                swal('Internal Server Error');
            })
        }
    }

    /** api call for selected interval value */
    selectInterval = prop => event => {
        this.state.isSelectHistorical = false;
        let intervalApiData = [];
        this.state.intervalArray = [];
        this.state.isComparedCompany = false;
        const intervalData = {
            symbol: prop,
            intervalValue: event.target.value
        }
        API.selectInterval(intervalData)
            .then((res) => {
                try {
                    this.setState({ isIntervalValue: true, isSelectinterval: true, isSelectHistorical: false, isComparedCompany: false, selectedInterval: prop, graphData: [], isLoaded: true });
                    let originalObject = res['Time Series (' + event.target.value + ')'];
                    console.log('originalObject: ', originalObject);
                    console.log("interval array======second time===>", this.state.intervalArray);
                    if (originalObject) {
                        for (let key in originalObject) {
                            intervalApiData.push({
                                date: key,
                                open: originalObject[key]['1. open'],
                                high: originalObject[key]['2. high'],
                                low: originalObject[key]['3. low'],
                                close: originalObject[key]['4. close'],
                                volume: originalObject[key]['5. volume']
                            })
                        }
                        this.setState({ intervalArray: intervalApiData, isIntervalValue: true })
                        this.displayGraphOfInterval();
                    } else {
                        setTimeout(this.setState({ isLoaded: true }), 3000);
                        swal('Internal Server Error');
                    }
                } catch (err) {
                    console.log("err====", err);
                    swal('Internal Server Error');
                }
            }).catch((err) => {
                swal('Internal Server Error');
            })
    };

    /** display graph of selected interval */
    displayGraphOfInterval() {
        const graphSeries = this.state.intervalArray;
        let chartData = 1484418600000;
        this.state.intervalData = [];
        for (let i = 0; i < graphSeries.length; i++) {
            chartData = chartData + 86400000;
            let obj = JSON.parse(graphSeries[i].volume)
            let innerArr = [chartData, obj];
            this.state.intervalData.push(innerArr);
        }
        let series = [{
            name: 'Stock price',
            type: 'area',
            data: this.state.intervalData
        }
        ]
        /**display chart of selected interval */
        let chartrender =
            <div id="chart">
                <ReactApexChart options={options} series={series} type="area" height="500" />
            </div>
        return (<div>
            {chartrender}
        </div>
        )
    }

    /** select company and call api of selected company */
    selectComparisonCompany = prop => event => {
        this.state.isComparedCompany = true;
        this.state.isSelectHistorical = false;
        this.state.isSelectinterval = false;
        this.state.isIndicatorGraph = false;
        this.state.isIntervalValue = false;
        const companySymbol = event.target.value
        API.selectComparisonCompany(companySymbol)
            .then((res) => {
                try {
                    this.setState({ isComparedCompany: true, firstCompany: prop, isIndicatorGraph: false, selectedCompany: event.target.value })
                    const originalObject = res['Time Series (5min)'];
                    console.log("res==========>", originalObject);
                    if (originalObject) {
                        for (let key in originalObject) {
                            this.state.firstSelectedCompanyArray.push({
                                date: key,
                                open: originalObject[key]['1. open'],
                                high: originalObject[key]['2. high'],
                                low: originalObject[key]['3. low'],
                                close: originalObject[key]['4. close'],
                                volume: originalObject[key]['5. volume']
                            })
                        }
                        console.log("comparison Array1=======>", this.state.firstSelectedCompanyArray);
                        this.comparedCompanyData();
                    } else {
                        setTimeout(this.setState({ isLoaded: true }), 3000);
                        swal('Internal Server Error');
                    }
                } catch (err) {
                    console.log("err:", err)
                    swal('Internal Server Error');
                }
            }).catch((err) => {
                swal('Internal Server Error');
            })
        console.log("this.state.isComparedCompany:", this.state.isComparedCompany);
    }

    /** get data of first selected company  */
    comparedCompanyData = () => {
        let selectedCompany = [];
        let firstSelectedCompany = this.state.firstCompany;
        API.selectComparisonCompany(firstSelectedCompany)
            .then((res) => {
                try {
                    console.log("res============>", res);
                    if (res.Note == 'Thank you for using Alpha Vantage! Our standard AP…would like to target a higher API call frequency.') {
                        alert('wait 1 minute');
                    } else {
                        const originalObjectforDisplay = res['Time Series (5min)'];
                        console.log("originalObject===========>", originalObjectforDisplay);
                        if (originalObjectforDisplay) {
                            for (let key in originalObjectforDisplay) {
                                selectedCompany.push({
                                    date: key,
                                    open: originalObjectforDisplay[key]['1. open'],
                                    high: originalObjectforDisplay[key]['2. high'],
                                    low: originalObjectforDisplay[key]['3. low'],
                                    close: originalObjectforDisplay[key]['4. close'],
                                    volume: originalObjectforDisplay[key]['5. volume']
                                })
                            }
                            this.setState({ secondSelectedCompanyArray: selectedCompany })
                            console.log("comparison Array2=======>", this.state.secondSelectedCompanyArray);
                        } else {
                            swal('Internal Server Error');
                        }
                    }
                    /**selecte other company then call below function */
                    if (this.state.secondSelectedCompanyArray.length && this.state.firstSelectedCompanyArray.length) {
                        this.displayGraphOfComparison();
                    }
                } catch (err) {
                    swal('Internal Server Error');
                }
            });
    }

    /** display table of both company*/
    displayGraphOfComparison() {
        if (this.state.firstSelectedCompanyArray.length && this.state.secondSelectedCompanyArray.length) {
            this.state.comparisonOfVolume = [];
            console.log("length1:::", this.state.firstSelectedCompanyArray.length);
            console.log("length2:::", this.state.secondSelectedCompanyArray.length);
            if (this.state.firstSelectedCompanyArray.length > this.state.secondSelectedCompanyArray.length) {
                for (let i = 0; i < this.state.secondSelectedCompanyArray.length; i++) {
                    console.log("volume1:", this.state.firstSelectedCompanyArray[i].volume);
                    console.log("volume2:", this.state.secondSelectedCompanyArray[i].volume)
                    this.state.comparisonOfVolume.push({ date: this.state.firstSelectedCompanyArray[i].date, diffrence: this.state.secondSelectedCompanyArray[i].volume - this.state.firstSelectedCompanyArray[i].volume, first: this.state.secondSelectedCompanyArray[i].volume, second: this.state.firstSelectedCompanyArray[i].volume });
                }
            } else {
                for (let i = 0; i < this.state.firstSelectedCompanyArray.length; i++) {
                    console.log("volume1:", this.state.firstSelectedCompanyArray[i].volume);
                    console.log("volume2:", this.state.secondSelectedCompanyArray[i].volume)
                    this.state.comparisonOfVolume.push({ date: this.state.firstSelectedCompanyArray[i].date, diffrence: this.state.secondSelectedCompanyArray[i].volume - this.state.firstSelectedCompanyArray[i].volume, first: this.state.secondSelectedCompanyArray[i].volume, second: this.state.firstSelectedCompanyArray[i].volume });
                }
            }
            return (
                <div>
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>{this.state.firstCompany}</TableCell>
                                    <TableCell>{this.state.selectedCompany}</TableCell>
                                    <TableCell>Differnce</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/**display table of compared company data */}
                                {this.state.comparisonOfVolume.map(data => (
                                    <TableRow key={data.diffrence}>
                                        <TableCell>{data.date}</TableCell>
                                        <TableCell>{data.first}</TableCell>
                                        <TableCell>{data.second}</TableCell>
                                        <TableCell>{data.diffrence}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            )
        }
    }

    /** select indicator and call API of selcted indicator */
    getSelectedIndicatorData = prop => event => {
        console.log("event:", event.target.value);
        console.log("prop:", prop);
        const indicatorData = {
            selectedCompanySymbol: prop,
            indicatorValue: event.target.value
        }
        API.getSelectedIndicatorData(indicatorData)
            .then((res) => {
                try {
                    this.setState({ indicatorGraphData: [], indicatorDataArray: [], isIndicatorGraph: true, isIntervalValue: false, isSelectHistorical: false, isComparedCompany: false })
                    const originalObject = res['Technical Analysis: ' + [event.target.value]];
                    console.log("result:", ['Technical Analysis: ' + [event.target.value]]);
                    console.log("originalObject:", originalObject);
                    console.log("isIndicatorGraph:", this.state.isIndicatorGraph);
                    if (originalObject) {
                        for (let key in originalObject) {
                            this.state.indicatorDataArray.push({
                                date: key,
                                indicatorObj: originalObject[key][event.target.value],
                            })
                        }
                    } else {
                        swal('Internal Server Error')
                    }
                    console.log("indicatorDataArray:", this.state.indicatorDataArray);
                    this.displayGraphOfIndicator()
                } catch (err) {
                    swal('Internal Server Error');
                }
            }).catch((err) => {
                console.log('hey error: ', err);
            })
    }

    /** display graph of selected indicator */
    displayGraphOfIndicator() {
        console.log("indicator fun called");
        let graphSeries = this.state.indicatorDataArray;
        console.log("length:", graphSeries.length);
        let chartData = 1484418600000;
        for (let i = 0; i < graphSeries.length; i++) {
            chartData = chartData + 86400000;
            let obj = JSON.parse(graphSeries[i].indicatorObj)
            let innerArr = [chartData, obj];
            this.state.indicatorGraphData.push(innerArr);
        }
        console.log("graphData:", this.state.indicatorGraphData);
        let options = {
            chart: {
                stacked: false,
                zoom: {
                    type: 'x',
                    enabled: true
                },
                toolbar: {
                    autoSelected: 'zoom'
                }
            },
            plotOptions: {
                line: {
                    curve: 'smooth',
                }
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 0,
                style: 'full',
            },
            colors: ['#ff4d4d'],
            opacity: 0.4,
            title: {
                text: 'Stock Price Movement',
                align: 'left'
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 90, 100]
                },
            },
            yaxis: {
                min: 0,
                max: 250,
                labels: {
                    formatter: function (val) {
                        return (val).toFixed(0);
                    },
                },
                title: {
                    text: 'Price'
                },
            },
            xaxis: {
                type: 'datetime',
            },
            tooltip: {
                shared: false,
                y: {
                    formatter: function (val) {
                        return (val / 1000).toFixed(0)
                    }
                }
            }
        }
        let series = [{
            name: 'Stock price',
            data: this.state.indicatorGraphData
        }]
        /**display graph of selected indicator */
        let chartrender =
            <div id="chart">
                <ReactApexChart options={options} series={series} type="area" height="500" />
            </div>
        return (<div>
            {chartrender}
        </div>
        )
    }

    /** display watchlist and graph or search list */
    displayCompanyList() {
        const { date } = this.state;
        /** any company added into current user watchlist */
        if (this.state.grapharray.length) {
            let graphSeries = this.state.grapharray;
            let chartData = 1484418600000;
            let graphData = [];
            for (let i = 0; i < graphSeries.length; i++) {
                chartData = chartData + 86400000;
                let obj = JSON.parse(graphSeries[i].volume)
                let innerArr = [chartData, obj];
                graphData.push(innerArr);
            }
            let series = [{
                name: 'Stock price',
                data: graphData
            },
            ]
            /** display graph of selected company */
            var chartrender =
                <div>
                    <div id="chart">
                        <ReactApexChart options={options} series={series} type="area" height="450" />
                    </div>
                    <div className="chart_bottom">
                        <ul>
                            <li style={{ color: 'gray' }}>Open: <span style={{ marginRight: 10 }}>{this.state.open}</span></li>
                            <li style={{ color: 'gray' }}>Close: <span style={{ marginRight: 10 }}>{this.state.close}</span></li>
                            <li style={{ color: 'gray' }}>High: <span style={{ marginRight: 10 }}>{this.state.high}</span></li>
                            <li style={{ color: 'gray' }}>Low: <span style={{ marginRight: 10 }}>{this.state.low}</span></li>
                            <li style={{ color: 'gray' }}>Volume: <span style={{ marginRight: 10 }}>{this.state.volume}</span></li>
                        </ul>
                    </div>
                </div>
        }
        /** it's display graph or serch response table */
        let showGraphOrSearchResult = this.state.searchResponse.length ? <div>
            <center><h3>Search Response....</h3></center>
            {this.state.searchResponse.map(data =>
                <List key={data['1. symbol']} className="list">
                    <ListItem>
                        <ListItemText className="search_list" primary={data['1. symbol']} secondary={data['2. name']} />
                        <ListItemSecondaryAction className="search_list1">
                            <IconButton color="primary" edge="end" aria-label="Delete" onClick={() => this.addCompanytoWatchlist(data)} className="addIcon">
                                <AddIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            )}
        </div> : (this.state.searchResponse ? <div>
            <Grid container spacing={1}>
                <Grid item sm={3}>
                    <span className="company_symbol">{this.state.clickCompanySymbol}</span><span style={{ color: 'gray' }}>{this.state.clickCompanyName}</span></Grid>
                <Grid item sm={9}>
                    {this.state.isGraphDisplay ? (<div className="listItem1">
                        <ul>
                            <li><TextField
                                select
                                style={{ float: 'right', padding: 10 }}
                                value={this.state.values.intervalRange}
                                onChange={this.selectComparisonCompany(this.state.clickCompanySymbol)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Comparison</InputAdornment>,
                                }}>
                                {this.state.companyData.map(company => (
                                    <MenuItem key={company.symbol} value={company.symbol}>
                                        {company.symbol}
                                    </MenuItem>
                                ))}
                            </TextField></li>
                            <li><TextField
                                select
                                style={{ float: 'right', padding: 10 }}
                                value={this.state.values.intervalRange}
                                onChange={this.getSelectedIndicatorData(this.state.clickCompanySymbol)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Indicator</InputAdornment>,
                                }}>
                                {indicatorList.map(indicator => (
                                    <MenuItem key={indicator.value} value={indicator.value} >
                                        {indicator.label}
                                    </MenuItem>
                                ))}
                            </TextField></li>
                            <li><TextField
                                select
                                style={{ float: 'right', padding: 10 }}
                                value={this.state.values.intervalRange}
                                onChange={this.selectInterval(this.state.clickCompanySymbol)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Interval</InputAdornment>,
                                }}>
                                {ranges.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField></li>
                            <li><span className="historical_data" style={{ padding: 10 }} onClick={() => this.displayHistoricalData(this.state.clickCompanySymbol)}>Historical Data</span></li>
                        </ul></div>) : ('')}
                </Grid>
            </Grid>
            {/** when select historical data at that time display table */}
            {this.state.isSelectHistorical ? (<div>
                <Paper>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Open</TableCell>
                                <TableCell align="right">High</TableCell>
                                <TableCell align="right">Low</TableCell>
                                <TableCell align="right">Close</TableCell>
                                <TableCell align="right">Adj Close</TableCell>
                                <TableCell align="right">Volume</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.historicalArray.map(historicalData => (
                                <TableRow key={historicalData.date}>
                                    <TableCell component="th" scope="row">{historicalData.date}</TableCell>
                                    <TableCell align="right">{historicalData.open}</TableCell>
                                    <TableCell align="right">{historicalData.high}</TableCell>
                                    <TableCell align="right">{historicalData.low}</TableCell>
                                    <TableCell align="right">{historicalData.close}</TableCell>
                                    <TableCell align="right">{historicalData.adjclose}</TableCell>
                                    <TableCell align="right">{historicalData.volume}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>) : (<div>{chartrender ? <div>{this.state.isIntervalValue ? <div>{this.displayGraphOfInterval()}</div> : <div>{this.state.isIndicatorGraph ? <div>{this.displayGraphOfIndicator()}</div> : <div>{this.state.isComparedCompany ? <div>{this.displayGraphOfComparison()}</div> : <div>{chartrender}</div>}</div>}</div>}</div>
                : <div></div>}</div>)}</div>
            : 'No data found')
        /** display watchlist company list */
        let displayCompany = this.state.companyData.length ? <div>{this.state.companyData.map(company =>
            <List key={company.key} className="cursorClass">
                <ListItem onClick={() => this.displaySelectedCompanyGraph(company)}>
                    <ListItemText primary={company.symbol} secondary={company.name} />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="Delete" style={{ color: '#ff4d4d' }} onClick={this.deleteCompany.bind(this, company.key)}>
                            <RemoveCircle />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        )} </div> : <div> <center><p>Add Comapany to watchlist</p></center></div>
        /** dispaly graph or search list and no company added or search then dispaly 'no data found' */
        let displayData = this.state.companyData.length ? <div>{showGraphOrSearchResult}</div> : <div><center><h2>No Company Found</h2></center></div>

        /** when searchbar is open but not enter a value */
        if (this.state.isOpenSearch && !this.state.isSearchClick) {
            return (
                <div>
                    <div className="grid_class">
                        <div className="stock_header">
                            <span style={{ fontSize: 25, marginLeft: 8, color: '#fff' }}><b>Stock</b></span><br />
                            <span style={{ fontSize: 17, color: 'gray', marginLeft: 8 }}>{date}</span>
                        </div>
                        <div className="logout">
                            <Link to="/login"><Button variant="contained" onClick={() => this.logOut()}>
                                <b>Logout</b>
                            </Button></Link>
                        </div>
                    </div>
                    {this.addComapny()}
                    <div className="grid_class1">
                        <Grid container spacing={1}>
                            <Grid item sm={3}>
                                <div className="company_list">
                                    <Grid container spacing={1}>
                                        <Grid item sm={10}>
                                            <p style={{ marginLeft: 18 }}>Manage WatchList</p>
                                        </Grid>
                                        <Grid item sm={2}>
                                            <p onClick={() => this.openCompanyList()} style={{ color: '#3f51b5', cursor: 'pointer' }}>Done</p>
                                        </Grid>
                                    </Grid>
                                    {this.state.companyData.map(company =>
                                        <List key={company.key} className="vl" >
                                            <ListItem >
                                                <ListItemText primary={company.symbol} secondary={company.name} />
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="Delete" style={{ color: '#ff4d4d' }} onClick={this.deleteCompany.bind(this, company.key)}>
                                                        <RemoveCircle />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </List>
                                    )}
                                </div>
                            </Grid>
                            <Grid item sm={9}>
                                <div className="search_bar">
                                    <form onSubmit={this.submitSearchValue}>
                                        <Typography variant="h6" noWrap>
                                            <TextField
                                                id="outlined-with-placeholder"
                                                label="Search"
                                                className="search_input"
                                                value={this.state.value}
                                                onChange={this.getSearchValue}
                                                margin="normal"
                                                variant="outlined"
                                            />
                                            <Button id="search" type="submit" onClick={this.submitSearchValue} style={{ color: '#fff' }} disabled={!this.state.value} autoFocus>
                                                Search
							            	</Button>
                                        </Typography>
                                    </form>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            )
            /** searchbar is open then it's return */
        } else if (this.state.isSearchClick) {
            if (!this.state.searchResponse.length) {
                console.log("========else if ========if======");
                return (
                    <div>
                        <div className="grid_class">
                            <div className="stock_header">
                                <span style={{ fontSize: 25, marginLeft: 8, color: '#fff' }}><b>Stock</b></span><br />
                                <span style={{ fontSize: 17, color: 'gray', marginLeft: 8 }}>{date}</span>
                            </div>
                            <div className="logout">
                                <Link to="/login"><Button variant="contained" onClick={() => this.logOut()}>
                                    <b>Logout</b>
                                </Button></Link>
                            </div>
                        </div>

                        {this.addComapny()}
                        <div className="grid_class1">
                            <div className="company_list">
                                <Grid container spacing={1}>
                                    <Grid item sm={10}>
                                        <p style={{ marginLeft: 18 }}>Manage Watchlist</p>
                                    </Grid>
                                    <Grid item sm={2}>
                                        <p onClick={() => this.openCompanyList()} style={{ color: '#3f51b5' }}>Done</p>
                                    </Grid>
                                </Grid>
                                {this.state.companyData.map(company =>
                                    <List key={company.key} className="cursorClass vl">
                                        <ListItem onClick={() => this.displaySelectedCompanyGraph(company)}>
                                            <ListItemText primary={company.symbol} secondary={company.name} />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="Delete" style={{ color: '#ff4d4d' }} onClick={this.deleteCompany.bind(this, company.key)}>
                                                    <RemoveCircle />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </List>
                                )}
                            </div>
                            <div className="searching_list">
                                <center><div className="searchCompany_list">
                                    <p style={{ marginRight: 296 }}>Showing Results for: <span style={{ textTransform: 'capitalize' }}><b>{this.state.searchValue}</b></span></p>
                                    No Data Found
					          </div>
                                </center>
                            </div>
                        </div>
                    </div>
                )
            } else {
                console.log("else if =========else");
                return (
                    <div>
                        <div className="grid_class">
                            <div className="stock_header">
                                <span style={{ fontSize: 25, marginLeft: 8, color: '#fff' }}><b>Stock</b></span><br />
                                <span style={{ fontSize: 17, color: 'gray', marginLeft: 8 }}>{date}</span>
                            </div>
                            <div className="logout">
                                <Link to="/login"><Button variant="contained" onClick={() => this.logOut()}>
                                    <b>Logout</b>
                                </Button></Link>
                            </div>
                        </div>
                        {this.addComapny()}
                        <div className="grid_class1">
                            <Grid container spacing={1}>
                                <Grid item sm={3}>
                                    <div className="company_list">
                                        <Grid container spacing={1}>
                                            <Grid item sm={10}>
                                                <p style={{ marginLeft: 18 }}>Manage Watchlist</p>
                                            </Grid>
                                            <Grid item sm={2}>
                                                <p onClick={() => this.openCompanyList()} style={{ color: '#3f51b5', cursor: 'pointer' }}>Done</p>
                                            </Grid>
                                        </Grid>
                                        {this.state.companyData.map(company =>
                                            <List key={company.key} >
                                                <ListItem className="vl">
                                                    <ListItemText primary={company.symbol} secondary={company.name} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton edge="end" aria-label="Delete" style={{ color: '#ff4d4d' }} onClick={this.deleteCompany.bind(this, company.key)}>
                                                            <RemoveCircle />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </List>
                                        )}
                                    </div>
                                </Grid>
                                <Grid item sm={9}>
                                    <div className="search_bar">
                                        <Typography variant="h6" noWrap>
                                            <TextField
                                                id="outlined-with-placeholder"
                                                label="Search"
                                                className="search_input"
                                                value={this.state.value}
                                                onChange={this.getSearchValue}
                                                margin="normal"
                                                variant="outlined"
                                            />
                                            <Button className="search_button" id="search" disabled={!this.state.value} onClick={this.submitSearchValue} style={{ color: '#fff' }} autoFocus>
                                                Search
									        </Button>
                                        </Typography>

                                        <center><div className="searchCompany_list">
                                            <p style={{ marginRight: 296 }}>Showing Results for: <span style={{ textTransform: 'capitalize' }}><b>{this.state.searchValue}</b></span></p>

                                            {this.state.searchResponse.map(data =>
                                                <List key={data['1. symbol']} >
                                                    <ListItem>
                                                        <ListItemText primary={data['1. symbol']} secondary={data['2. name']} />
                                                        <ListItemSecondaryAction >
                                                            <IconButton color="primary" edge="end" aria-label="Delete" onClick={() => this.addCompanytoWatchlist(data)} >
                                                                <AddIcon />
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                </List>
                                            )}
                                        </div>	</center>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                )
            }
        } else {
            if (!this.state.isOpenCompanyList) {
                console.log("=====else ==========if");
                return (
                    <div>
                        <div className="grid_class">
                            <div className="stock_header">
                                <span style={{ fontSize: 25, marginLeft: 8, color: '#fff' }}><b>Stock</b></span><br />
                                <span style={{ fontSize: 17, color: 'gray', marginLeft: 8 }}>{date}</span>
                            </div>
                            <div className="logout">
                                <Link to="/login"><Button variant="contained" onClick={() => this.logOut()}>
                                    <b>Logout</b>
                                </Button></Link>
                            </div>
                        </div>
                        <div className="grid_class1">
                            <Grid container>
                                <Grid item sm={3}>
                                    <div className="company_list">
                                        <div className="plus_class">
                                            <Grid container spacing={1}>
                                                <Grid item sm={4}>
                                                    <IconButton color="primary" edge="end" aria-label="Delete" className="addIcon" onClick={() => this.openSearchbar()}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item sm={8}>
                                                    <p><b>Manage WatchList</b></p>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        {displayCompany}
                                    </div>
                                </Grid>
                                <Grid item sm={9}>
                                    <div className="graph_list">
                                        {displayData}
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                )
            }

        }
    }

    /** get data of searching company */
    getApiData() {
        console.log("value:", this.state.value);
        const companySymbol = this.state.value;
        API.getApiData(companySymbol)
            .then((res) => {
                try {
                    console.log("resssssssss:", res);
                    console.log("data of response:", res['bestMatches']);
                    this.setState({
                        searchResponse: res['bestMatches'],
                        isSearchClick: true,
                        isLoaded: true
                    });
                    if (!this.state.searchResponse.length) {
                        console.log("searchrespone:", this.state.searchResponse.length);
                        console.log("===if callling===");
                        return (
                            <div>
                                "No Data Found"
							</div>
                        )
                    }
                } catch (err) {
                    swal('Internal Server Error');
                }
            }).catch((err) => {
                swal('Internal Server Error');
            })
    }

    /** get current date */
    getDate = () => {
        let date = new Date().toDateString();
        this.setState({ date });
    };

	/**
	 * @param {string} id wise delete company from watchlist 
	 */
    deleteCompany(id) {
        firebase.firestore().collection('company').doc(id).delete().then(() => {
            console.log("cdata:", this.state.companyData);
            swal("Successfully deleted!", "", "success");
            console.log("Document successfully deleted!");
            if (this.state.companyData.length === 1) {
                window.location.reload();
            }
        }).catch((error) => {
            swal('Internal Server Error');
        });
    }

	/**
	 * @param {object} data wise display graph 
	 */
    displaySelectedCompanyGraph(data) {
        this.state.isSelectHistorical = false;
        this.state.isIndicatorGraph = false;
        this.state.isComparedCompany = false;
        this.state.isSelectinterval = false;
        this.state.isIntervalValue = false;
        this.setState({
            isLoaded: false, isSelectinterval: false, isSelectHistorical: false, isComparedCompany: false, isIndicatorGraph: false
        })
        console.log('data: ', data);
        let grapharray = [];
        const companySymbol = data.symbol;
        API.displaySelectedCompanyGraph(companySymbol)
            .then((res) => {
                try {
                    const error = res['Error Message']
                    if (res) {
                        const originalObject = res['Time Series (5min)'];
                        if (originalObject) {
                            for (let key in originalObject) {
                                grapharray.push({
                                    date: key,
                                    open: originalObject[key]['1. open'],
                                    high: originalObject[key]['2. high'],
                                    low: originalObject[key]['3. low'],
                                    close: originalObject[key]['4. close'],
                                    volume: originalObject[key]['5. volume']
                                })
                            }
                            this.setState({
                                grapharray: grapharray,
                                open: grapharray['0'].open,
                                close: grapharray['0'].close,
                                high: grapharray['0'].high,
                                low: grapharray['0'].low,
                                volume: grapharray['0'].volume,
                                clickCompanyName: data.name,
                                clickCompanySymbol: data.symbol,
                                isLoaded: true,
                                isGraphDisplay: true
                            })
                            console.log("isGraphDisplay after======>", this.state.isGraphDisplay);
                        } else if (error) {
                            setTimeout(this.setState({ isLoaded: true }), 3000);
                            if (error === 'Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_INTRADAY.') {
                                swal('There is no data found!');
                            } else {
                                swal('Internal Server Error')
                            }
                        }
                    }
                }
                catch (err) {
                    swal('Internal Server Error ');
                }
            }).catch((err) => {
                swal('Internal Server Error')
            })
    }

    /** logout and clear localstorage */
    logOut = () => {
        firebase
            .auth()
            .signOut().then(function () {
                console.log('Signed Out');
                localStorage.clear();
                localStorage.removeItem('email1');
                console.log(localStorage);
                history.push('/')
            }, function (error) {
                swal('Internal Server Error');
            });
    }

    /** open searchbar onclick of plus sign */
    openSearchbar() {
        this.setState({
            isOpenSearch: true
        });
    }

    /** display watchlist onclick of done */
    openCompanyList() {
        this.setState({ isOpenCompanyList: false })
        console.log("isOpenCompanyList:", this.state.isOpenCompanyList);
        history.push('/Watch-list')
    }

    /** get current user added company from database */
    getCompany() {
        let companyData = [];
        localStorage.getItem('email1')
        let email = localStorage.email1;
        console.log('email==========>', email);
        firebase.firestore().collection("company").where("email", "==", email)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    const { name, symbol } = doc.data();
                    companyData.push({
                        key: doc.id,
                        doc,
                        name,
                        symbol,
                    });
                });
                setLoader(true);
                if (companyData.length) {
                    console.log('found data==========>', companyData);
                    setTheState(companyData);
                    console.log("call");
                    displayGraph()
                } else {
                    return (
                        <div>
                            <p>No data found</p>
                        </div>
                    )
                }
            }).catch(function (error) {
                console.log("Error getting documents: ", error);
            });

        let setLoader = (isLoaded) => {
            this.setState({
                isLoaded: isLoaded
            })
        }

        let setTheState = (companyData) => {
            this.setState({
                companyData: companyData,
                isLoaded: true
            })
        }
        let displayGraph = () => {
            console.log("companyData before:", this.state.companyData);
            console.log("companyData:", this.state.companyData);
            let firstCompanySymbol = this.state.companyData[0];
            console.log("firstCompanySymbol", firstCompanySymbol);
            this.displaySelectedCompanyGraph(firstCompanySymbol)
        }
    }

    render() {
        const { isLoaded } = this.state;
        if (!isLoaded) {
            return (
                <center>
                    <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </center>
            )
        } else if (isLoaded) {
            return (
                <div className="main">
                    {this.displayCompanyList()}
                </div>
            )
        } else {
            return (
                <div>
                    <h2>Sorry no data found</h2>
                </div>
            );
        }
    }
}


export default Companylist

