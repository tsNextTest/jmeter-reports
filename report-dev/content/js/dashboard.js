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

    var data = {"OkPercent": 91.66666666666667, "KoPercent": 8.333333333333334};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.90625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "3. POST /admin/api/v1/city/query"], "isController": false}, {"data": [1.0, 500, 1500, "4. POST /admin/api/v1/venue/query"], "isController": false}, {"data": [1.0, 500, 1500, "6. POST /admin/api/v1/show/query"], "isController": false}, {"data": [0.0, 500, 1500, "15. POST /admin/api/v1/service-fee/query"], "isController": false}, {"data": [1.0, 500, 1500, "1. POST /admin/api/v1/country/query"], "isController": false}, {"data": [1.0, 500, 1500, "5. POST /admin/api/v1/hall/query"], "isController": false}, {"data": [1.0, 500, 1500, "36. POST /widget/api/v1/event/{eventId}/root-tickets"], "isController": false}, {"data": [0.75, 500, 1500, "32. GET /widget/api/v1/show/{showId}"], "isController": false}, {"data": [1.0, 500, 1500, "33. POST /widget/api/v1/event/tabs/query"], "isController": false}, {"data": [1.0, 500, 1500, "34. POST /widget/api/v1/event/tabs/events/query"], "isController": false}, {"data": [1.0, 500, 1500, "7. POST /admin/api/v1/event/query"], "isController": false}, {"data": [1.0, 500, 1500, "13. POST /admin/api/v1/discount/query"], "isController": false}, {"data": [1.0, 500, 1500, "2. POST /admin/api/v1/state/query"], "isController": false}, {"data": [1.0, 500, 1500, "10. POST /admin/api/v1/root-ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "11. POST /admin/api/v1/ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "35. GET /widget/api/v1/event/{eventId}"], "isController": false}, {"data": [1.0, 500, 1500, "38. GET /widget/api/v1/event/{eventId}/tickets"], "isController": false}, {"data": [1.0, 500, 1500, "39. GET /widget/api/v1/cart/{cartId}"], "isController": false}, {"data": [1.0, 500, 1500, "14. POST /admin/api/v1/dealer-discount/query"], "isController": false}, {"data": [1.0, 500, 1500, "37. POST /widget/api/v1/cart"], "isController": false}, {"data": [0.0, 500, 1500, "40. POST /widget/api/v1/cart/{cartId}/root-ticket"], "isController": false}, {"data": [1.0, 500, 1500, "12. POST /admin/api/v1/quota/query"], "isController": false}, {"data": [1.0, 500, 1500, "9. POST /admin/api/v1/tariff/query"], "isController": false}, {"data": [1.0, 500, 1500, "8. POST /admin/api/v1/age-raiting/query"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48, 4, 8.333333333333334, 179.33333333333334, 60, 624, 142.0, 318.30000000000007, 433.95, 624.0, 16.2877502544961, 446.4703246946047, 19.4036705760095], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["3. POST /admin/api/v1/city/query", 2, 0, 0.0, 187.5, 179, 196, 187.5, 196.0, 196.0, 196.0, 4.0733197556008145, 135.35434699592668, 6.251193355397149], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 2, 0, 0.0, 201.5, 187, 216, 201.5, 216.0, 216.0, 216.0, 3.9138943248532287, 326.29800636007826, 5.998883928571429], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 2, 0, 0.0, 159.0, 146, 172, 159.0, 172.0, 172.0, 172.0, 4.773269689737471, 6.731056085918855, 7.642359039379476], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, 100.0, 95.5, 92, 99, 95.5, 99.0, 99.0, 99.0, 10.989010989010989, 9.314903846153847, 16.703511332417584], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 2, 0, 0.0, 314.0, 253, 375, 314.0, 375.0, 375.0, 375.0, 2.840909090909091, 11.039040305397728, 4.251653497869318], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 2, 0, 0.0, 172.5, 135, 210, 172.5, 210.0, 210.0, 210.0, 4.366812227074235, 177.35696984170306, 6.812482942139738], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 2, 0, 0.0, 167.5, 142, 193, 167.5, 193.0, 193.0, 193.0, 7.575757575757576, 10.1318359375, 4.2539654356060606], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 2, 0, 0.0, 454.0, 284, 624, 454.0, 624.0, 624.0, 624.0, 2.7210884353741496, 2.7117878401360547, 1.3233418367346939], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 2, 0, 0.0, 109.0, 98, 120, 109.0, 120.0, 120.0, 120.0, 9.615384615384617, 5.662184495192308, 5.164513221153847], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 2, 0, 0.0, 111.0, 109, 113, 111.0, 113.0, 113.0, 113.0, 10.204081632653061, 10.47313456632653, 6.178252551020408], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 2, 0, 0.0, 257.0, 244, 270, 257.0, 270.0, 270.0, 270.0, 3.6832412523020257, 480.776286256906, 5.656149286372007], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 2, 0, 0.0, 120.0, 109, 131, 120.0, 131.0, 131.0, 131.0, 8.0, 176.8828125, 12.51171875], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 2, 0, 0.0, 173.5, 165, 182, 173.5, 182.0, 182.0, 182.0, 4.048582995951417, 65.76179782388664, 6.217184337044534], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 2, 0, 0.0, 146.0, 142, 150, 146.0, 150.0, 150.0, 150.0, 4.47427293064877, 23.708403243847876, 7.609322567114094], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 2, 0, 0.0, 369.5, 301, 438, 369.5, 438.0, 438.0, 438.0, 3.33889816360601, 746.0252765025042, 6.989187708681135], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 2, 0, 0.0, 147.0, 127, 167, 147.0, 167.0, 167.0, 167.0, 8.0, 13.44140625, 3.8984375], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 2, 0, 0.0, 85.5, 60, 111, 85.5, 111.0, 111.0, 111.0, 16.528925619834713, 6.9812112603305785, 8.183755165289256], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 2, 0, 0.0, 102.5, 102, 103, 102.5, 103.0, 103.0, 103.0, 17.699115044247787, 13.499032079646017, 8.607577433628318], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 2, 0, 0.0, 129.0, 112, 146, 129.0, 146.0, 146.0, 146.0, 8.695652173913043, 159.375, 13.65913722826087], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 2, 0, 0.0, 91.5, 87, 96, 91.5, 96.0, 96.0, 96.0, 12.738853503184714, 6.257464171974522, 6.170382165605096], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, 100.0, 370.5, 312, 429, 370.5, 429.0, 429.0, 429.0, 4.555808656036446, 19.246511958997722, 2.816237186788155], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 2, 0, 0.0, 108.5, 98, 119, 108.5, 119.0, 119.0, 119.0, 7.662835249042145, 102.97309027777777, 11.812290469348659], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 2, 0, 0.0, 118.0, 111, 125, 118.0, 125.0, 125.0, 125.0, 4.651162790697675, 109.64525799418605, 6.956304505813954], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 2, 0, 0.0, 114.0, 104, 124, 114.0, 124.0, 124.0, 124.0, 4.7281323877068555, 141.98249113475177, 7.3161384456264775], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 2, 50.0, 4.166666666666667], "isController": false}, {"data": ["422/Unprocessable Entity", 2, 50.0, 4.166666666666667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 48, 4, "500/Internal Server Error", 2, "422/Unprocessable Entity", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, "422/Unprocessable Entity", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
