/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 24.390243902439025, "KoPercent": 75.60975609756098};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15853658536585366, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "17. POST /admin/api/v1/payment/query"], "isController": false}, {"data": [0.0, 500, 1500, "29. POST /admin/api/v1/notification/system/query"], "isController": false}, {"data": [0.0, 500, 1500, "3. POST /admin/api/v1/city/query"], "isController": false}, {"data": [0.0, 500, 1500, "6. POST /admin/api/v1/show/query"], "isController": false}, {"data": [0.0, 500, 1500, "16. POST /admin/api/v1/order/query"], "isController": false}, {"data": [0.0, 500, 1500, "1. POST /admin/api/v1/country/query"], "isController": false}, {"data": [0.5, 500, 1500, "36. POST /widget/api/v1/event/{eventId}/root-tickets"], "isController": false}, {"data": [0.0, 500, 1500, "20. POST /admin/api/v1/legalentity/query"], "isController": false}, {"data": [0.0, 500, 1500, "13. POST /admin/api/v1/discount/query"], "isController": false}, {"data": [0.0, 500, 1500, "11. POST /admin/api/v1/ticket/query"], "isController": false}, {"data": [0.0, 500, 1500, "38. GET /widget/api/v1/event/{eventId}/tickets"], "isController": false}, {"data": [0.0, 500, 1500, "26. POST /admin/api/v1/template-group/query"], "isController": false}, {"data": [0.0, 500, 1500, "28. POST /admin/api/v1/pushkaGateway/query"], "isController": false}, {"data": [0.0, 500, 1500, "23. POST /admin/api/v1/invitation/query"], "isController": false}, {"data": [0.0, 500, 1500, "27. POST /admin/api/v1/terminal/query"], "isController": false}, {"data": [1.0, 500, 1500, "37. POST /widget/api/v1/cart"], "isController": false}, {"data": [0.0, 500, 1500, "25. POST /admin/api/v1/paypoint/query"], "isController": false}, {"data": [0.0, 500, 1500, "12. POST /admin/api/v1/quota/query"], "isController": false}, {"data": [0.0, 500, 1500, "9. POST /admin/api/v1/tariff/query"], "isController": false}, {"data": [0.0, 500, 1500, "19. POST /admin/api/v1/customer/query"], "isController": false}, {"data": [0.0, 500, 1500, "22. POST /admin/api/v1/user/query"], "isController": false}, {"data": [0.0, 500, 1500, "8. POST /admin/api/v1/age-raiting/query"], "isController": false}, {"data": [0.0, 500, 1500, "24. POST /admin/api/v1/gateway/query"], "isController": false}, {"data": [0.0, 500, 1500, "4. POST /admin/api/v1/venue/query"], "isController": false}, {"data": [0.0, 500, 1500, "15. POST /admin/api/v1/service-fee/query"], "isController": false}, {"data": [0.0, 500, 1500, "21. POST /admin/api/v1/contract/query"], "isController": false}, {"data": [0.5, 500, 1500, "41. POST /widget/api/v1/cart/{cartId}/ticket"], "isController": false}, {"data": [0.0, 500, 1500, "5. POST /admin/api/v1/hall/query"], "isController": false}, {"data": [0.0, 500, 1500, "30. POST /admin/api/v1/sender-settings/query"], "isController": false}, {"data": [0.5, 500, 1500, "32. GET /widget/api/v1/show/{showId}"], "isController": false}, {"data": [1.0, 500, 1500, "33. POST /widget/api/v1/event/tabs/query"], "isController": false}, {"data": [0.0, 500, 1500, "7. POST /admin/api/v1/event/query"], "isController": false}, {"data": [1.0, 500, 1500, "34. POST /widget/api/v1/event/tabs/events/query"], "isController": false}, {"data": [0.0, 500, 1500, "2. POST /admin/api/v1/state/query"], "isController": false}, {"data": [0.0, 500, 1500, "10. POST /admin/api/v1/root-ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "35. GET /widget/api/v1/event/{eventId}"], "isController": false}, {"data": [1.0, 500, 1500, "39. GET /widget/api/v1/cart/{cartId}"], "isController": false}, {"data": [0.0, 500, 1500, "31. POST /admin/api/v1/progressbar/query"], "isController": false}, {"data": [0.0, 500, 1500, "42. POST /widget/api/v1/order"], "isController": false}, {"data": [0.0, 500, 1500, "14. POST /admin/api/v1/dealer-discount/query"], "isController": false}, {"data": [0.0, 500, 1500, "18. POST /admin/api/v1/cart/query"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41, 31, 75.60975609756098, 700.5853658536586, 67, 17919, 102.0, 1017.6000000000004, 2911.7999999999975, 17919.0, 1.6413130504403524, 101.63298607636109, 2.1893686824459566], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 7.290377475247524, 16.176129331683168], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 1, 100.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 9.714894480519481, 19.721489448051948], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 7.120373179611651, 14.99924150485437], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 7.2613706683168315, 15.953743811881187], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 7.1298543689320395, 17.028216019417478], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 1, 1, 100.0, 944.0, 944, 944, 944.0, 944.0, 944.0, 944.0, 1.0593220338983051, 0.7800086069915254, 1.5962245100635595], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.7980067686357244, 0.785645218002813], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 1, 100.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 8.13444368131868, 17.33130151098901], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 1, 100.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 9.963576858108109, 21.27322635135135], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 1, 100.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 7.003348214285714, 20.033482142857142], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 0, 0.0, 17919.0, 17919, 17919, 17919.0, 17919.0, 17919.0, 17919.0, 0.05580668564093978, 139.69258146032143, 0.02746735308890005], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 1, 100.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 9.651481331168831, 20.54586038961039], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 1, 100.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 10.166952054794521, 20.721853595890412], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 1, 100.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 10.006421232876713, 21.671660958904113], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, 100.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 11.004547574626866, 24.049673507462686], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 2.3961509146341466, 2.3485137195121952], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 1, 100.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 8.674172794117647, 18.520220588235293], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 1, 100.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 3.653606965174129, 7.720188121890547], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 1, 1, 100.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 7.8228889627659575, 16.019780585106382], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 1, 100.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 6.702769886363637, 14.701704545454545], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 1, 100.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 7.236328125, 15.52734375], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 1, 1, 100.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 6.8540219907407405, 14.42238136574074], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 1, 100.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 9.817708333333334, 20.091145833333336], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 1, 1, 100.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 7.4936224489795915, 15.744579081632653], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, 100.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 7.553411989795918, 15.615035076530612], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 7.158297936893204, 15.094053398058254], "isController": false}, {"data": ["41. POST /widget/api/v1/cart/{cartId}/ticket", 1, 0, 0.0, 1101.0, 1101, 1101, 1101.0, 1101.0, 1101.0, 1101.0, 0.9082652134423251, 4.176778212988193, 0.5375085149863761], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 1, 1, 100.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 6.854191004672898, 14.675817757009346], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 1, 100.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 10.335286458333334, 21.687825520833336], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 1, 0, 0.0, 1036.0, 1036, 1036, 1036.0, 1036.0, 1036.0, 1036.0, 0.9652509652509653, 0.6193065275096525, 0.46660080839768336], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 2.639619430693069, 2.6444538985148514], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 1, 1, 100.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 7.570876288659794, 15.937097293814432], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 5.334924768518518, 2.2316261574074074], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 1, 1, 100.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 8.345170454545455, 17.567027698863637], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 7.257199754901961, 16.77389705882353], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 15.0390625, 2.306547619047619], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 1, 0, 0.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 118.0, 8.474576271186441, 6.281448622881356, 4.096596927966102], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 1, 100.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 9.499289772727273, 19.62002840909091], "isController": false}, {"data": ["42. POST /widget/api/v1/order", 1, 0, 0.0, 3113.0, 3113, 3113, 3113.0, 3113.0, 3113.0, 3113.0, 0.32123353678124, 0.2020257789913267, 0.25096370061034373], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 1, 100.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 5.553288246268656, 11.798915578358208], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 7.2613706683168315, 15.489634900990097], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 31, 100.0, 75.60975609756098], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41, 31, "401/Unauthorized", 31, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
