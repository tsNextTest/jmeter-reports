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

    var data = {"OkPercent": 92.6829268292683, "KoPercent": 7.317073170731708};
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
    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41, 3, 7.317073170731708, 3180.7560975609745, 105, 30093, 728.0, 8459.200000000004, 24805.999999999978, 30093.0, 0.5774566555400629, 49.39686148786637, 0.7625882910099857], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 0, 0.0, 4357.0, 4357, 4357, 4357.0, 4357.0, 4357.0, 4357.0, 0.22951572182694516, 31.624307866651364, 0.37475613954555886], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 13.14233054577465, 10.687169894366198], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 0, 0.0, 913.0, 913, 913, 913.0, 913.0, 913.0, 913.0, 1.095290251916758, 0.47170214950711936, 1.9199667990142386], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 1.1235119047619047, 1.0639880952380951], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 0, 0.0, 1570.0, 1570, 1570, 1570.0, 1570.0, 1570.0, 1570.0, 0.6369426751592356, 234.04160031847132, 1.0039311305732483], "isController": false}, {"data": ["07. POST /admin/api/v1/event/query", 1, 0, 0.0, 12170.0, 12170, 12170, 12170.0, 12170.0, 12170.0, 12170.0, 0.08216926869350863, 10.841849835661463, 0.12694510065735415], "isController": false}, {"data": ["02. POST /admin/api/v1/state/query", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 34.86510093167702, 3.198596014492754], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 0, 0.0, 1230.0, 1230, 1230, 1230.0, 1230.0, 1230.0, 1230.0, 0.8130081300813008, 40.56783536585366, 1.2790586890243902], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 0, 0.0, 4190.0, 4190, 4190, 4190.0, 4190.0, 4190.0, 4190.0, 0.23866348448687352, 60.80604862768496, 0.5017992989260143], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 1, 100.0, 30093.0, 30093, 30093, 30093.0, 30093.0, 30093.0, 30093.0, 0.03323031934336889, 0.0964458096567308, 0.0], "isController": false}, {"data": ["09. POST /admin/api/v1/tariff/query", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 64.88306822831424, 2.462983326513912], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 0, 0.0, 1769.0, 1769, 1769, 1769.0, 1769.0, 1769.0, 1769.0, 0.5652911249293385, 1070.4990902345958, 0.893756182871679], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.8004908224907062, 2.8098861524163565], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 138.91962361453201, 3.8942233682266005], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 34.86173115079365, 8.520378637566138], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 1, 0, 0.0, 1416.0, 1416, 1416, 1416.0, 1416.0, 1416.0, 1416.0, 0.7062146892655368, 0.3475900423728814, 0.34000375176553677], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 68.7962582236842, 6.900185032894736], "isController": false}, {"data": ["04. POST /admin/api/v1/venue/query", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 133.24023752012883, 2.4830792069243155], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 1.9435508578431373, 3.80093443627451], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 0, 0.0, 8702.0, 8702, 8702, 8702.0, 8702.0, 8702.0, 8702.0, 0.11491611123879568, 6.682641203171685, 0.18572867587910824], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 107.0235906862745, 6.0853247549019605], "isController": false}, {"data": ["06. POST /admin/api/v1/show/query", 1, 0, 0.0, 849.0, 849, 849, 849.0, 849.0, 849.0, 849.0, 1.1778563015312131, 48.95810328327444, 1.8967627355712604], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 124.07424132947978, 4.3521947254335265], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 19.71962246192893, 7.762928299492385], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 147.40705818965517, 3.5717492816091956], "isController": false}, {"data": ["41. POST /widget/api/v1/cart/{cartId}/ticket", 1, 1, 100.0, 1555.0, 1555, 1555, 1555.0, 1555.0, 1555.0, 1555.0, 0.6430868167202572, 0.6368066720257235, 0.36550442122186494], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 71.60175492610837, 7.6874230295566495], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 1, 0, 0.0, 6311.0, 6311, 6311, 6311.0, 6311.0, 6311.0, 6311.0, 0.15845349389954047, 0.10553250277293615, 0.07659617136745366], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 1, 0, 0.0, 3072.0, 3072, 3072, 3072.0, 3072.0, 3072.0, 3072.0, 0.3255208333333333, 0.1811981201171875, 0.1738866170247396], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 1, 0, 0.0, 1124.0, 1124, 1124, 1124.0, 1124.0, 1124.0, 1124.0, 0.889679715302491, 1.3015041147686832, 0.5360667815836299], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 13.879933421305182, 3.2820747360844527], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 1, 0, 0.0, 6452.0, 6452, 6452, 6452.0, 6452.0, 6452.0, 6452.0, 0.15499070055796652, 0.4928219931804092, 0.07507362058276504], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 1, 0, 0.0, 7488.0, 7488, 7488, 7488.0, 7488.0, 7488.0, 7488.0, 0.13354700854700857, 0.10224692841880341, 0.06455641526442307], "isController": false}, {"data": ["01. POST /admin/api/v1/country/query", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 9.57461033007335, 3.681807762836186], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 4.092261904761905, 14.378720238095239], "isController": false}, {"data": ["08. POST /admin/api/v1/age-raiting/query", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 12.73956759818731, 4.702841767371601], "isController": false}, {"data": ["42. POST /widget/api/v1/order", 1, 1, 100.0, 1411.0, 1411, 1411, 1411.0, 1411.0, 1411.0, 1411.0, 0.7087172218284905, 0.5841380226789511, 0.5536853295535081], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 0, 0.0, 1285.0, 1285, 1285, 1285.0, 1285.0, 1285.0, 1285.0, 0.7782101167315175, 29.30599464980545, 1.2296327821011674], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 75.45152601304946, 2.1476326407967035], "isController": false}, {"data": ["05. POST /admin/api/v1/hall/query", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 78.07469749111901, 2.7874528197158086], "isController": false}, {"data": ["03. POST /admin/api/v1/city/query", 1, 0, 0.0, 26210.0, 26210, 26210, 26210.0, 26210.0, 26210.0, 26210.0, 0.03815337657382678, 1.2587260945249905, 0.05890672691720717], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 1, 33.333333333333336, 2.4390243902439024], "isController": false}, {"data": ["422/Unprocessable Entity", 1, 33.333333333333336, 2.4390243902439024], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, 33.333333333333336, 2.4390243902439024], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41, 3, "400/Bad Request", 1, "422/Unprocessable Entity", 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["41. POST /widget/api/v1/cart/{cartId}/ticket", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["42. POST /widget/api/v1/order", 1, 1, "422/Unprocessable Entity", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
