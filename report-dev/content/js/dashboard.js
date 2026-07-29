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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9166666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "3. POST /admin/api/v1/city/query"], "isController": false}, {"data": [1.0, 500, 1500, "4. POST /admin/api/v1/venue/query"], "isController": false}, {"data": [1.0, 500, 1500, "6. POST /admin/api/v1/show/query"], "isController": false}, {"data": [0.0, 500, 1500, "15. POST /admin/api/v1/service-fee/query"], "isController": false}, {"data": [1.0, 500, 1500, "1. POST /admin/api/v1/country/query"], "isController": false}, {"data": [1.0, 500, 1500, "36. POST /widget/api/v1/event/{eventId}/root-tickets"], "isController": false}, {"data": [1.0, 500, 1500, "5. POST /admin/api/v1/hall/query"], "isController": false}, {"data": [1.0, 500, 1500, "32. GET /widget/api/v1/show/{showId}"], "isController": false}, {"data": [1.0, 500, 1500, "33. POST /widget/api/v1/event/tabs/query"], "isController": false}, {"data": [1.0, 500, 1500, "34. POST /widget/api/v1/event/tabs/events/query"], "isController": false}, {"data": [1.0, 500, 1500, "7. POST /admin/api/v1/event/query"], "isController": false}, {"data": [1.0, 500, 1500, "13. POST /admin/api/v1/discount/query"], "isController": false}, {"data": [1.0, 500, 1500, "2. POST /admin/api/v1/state/query"], "isController": false}, {"data": [1.0, 500, 1500, "10. POST /admin/api/v1/root-ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "11. POST /admin/api/v1/ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "35. GET /widget/api/v1/event/{eventId}"], "isController": false}, {"data": [1.0, 500, 1500, "38. GET /widget/api/v1/event/{eventId}/tickets"], "isController": false}, {"data": [1.0, 500, 1500, "39. GET /widget/api/v1/cart/{cartId}"], "isController": false}, {"data": [1.0, 500, 1500, "14. POST /admin/api/v1/dealer-discount/query"], "isController": false}, {"data": [1.0, 500, 1500, "37. POST /widget/api/v1/cart"], "isController": false}, {"data": [0.0, 500, 1500, "40. POST /widget/api/v1/cart/{cartId}/root-ticket"], "isController": false}, {"data": [1.0, 500, 1500, "12. POST /admin/api/v1/quota/query"], "isController": false}, {"data": [1.0, 500, 1500, "9. POST /admin/api/v1/tariff/query"], "isController": false}, {"data": [1.0, 500, 1500, "8. POST /admin/api/v1/age-raiting/query"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48, 4, 8.333333333333334, 158.1458333333333, 59, 406, 136.5, 250.40000000000003, 333.4, 406.0, 16.73056814220983, 458.5452792784942, 19.931201529278493], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["3. POST /admin/api/v1/city/query", 2, 0, 0.0, 181.0, 179, 183, 181.0, 183.0, 183.0, 183.0, 3.8535645472061657, 128.04822976878611, 5.9139420761079], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 2, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 3.8535645472061657, 321.2683646435453, 5.906415582851637], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 2, 0, 0.0, 168.0, 136, 200, 168.0, 200.0, 200.0, 200.0, 3.5842293906810037, 5.05257336469534, 5.738617271505376], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, 100.0, 97.0, 91, 103, 97.0, 103.0, 103.0, 103.0, 6.8728522336769755, 5.8258161512027495, 10.446869630584192], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 2, 0, 0.0, 283.0, 237, 329, 283.0, 329.0, 329.0, 329.0, 2.894356005788712, 11.246721237337193, 4.331641190303908], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 2, 0, 0.0, 155.0, 148, 162, 155.0, 162.0, 162.0, 162.0, 4.484304932735426, 5.999509529147982, 2.518042320627803], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 2, 0, 0.0, 149.5, 138, 161, 149.5, 161.0, 161.0, 161.0, 4.040404040404041, 164.09801136363637, 6.303267045454546], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 2, 0, 0.0, 287.0, 237, 337, 287.0, 337.0, 337.0, 337.0, 2.894356005788712, 2.880223408104197, 1.4076067293777135], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 2, 0, 0.0, 105.5, 91, 120, 105.5, 120.0, 120.0, 120.0, 4.484304932735426, 2.6362808295964126, 2.4085622197309418], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 2, 0, 0.0, 125.0, 112, 138, 125.0, 138.0, 138.0, 138.0, 4.576659038901602, 4.6973326659038905, 2.771024027459954], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 2, 0, 0.0, 234.0, 221, 247, 234.0, 247.0, 247.0, 247.0, 3.115264797507788, 406.6378869742991, 4.783939349688473], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 2, 0, 0.0, 118.0, 109, 127, 118.0, 127.0, 127.0, 127.0, 6.309148264984227, 139.5036474763407, 9.867286080441641], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 2, 0, 0.0, 167.5, 156, 179, 167.5, 179.0, 179.0, 179.0, 3.8535645472061657, 62.59031791907514, 5.917705322736031], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 2, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 4.0983606557377055, 21.716508709016395, 6.970014728483607], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 2, 0, 0.0, 343.5, 281, 406, 343.5, 406.0, 406.0, 406.0, 3.1397174254317113, 701.5214138540031, 6.572250294348509], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 2, 0, 0.0, 110.0, 103, 117, 110.0, 117.0, 117.0, 117.0, 4.975124378109452, 8.35665422885572, 2.4244014303482584], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 2, 0, 0.0, 59.5, 59, 60, 59.5, 60.0, 60.0, 60.0, 4.830917874396135, 1.6276041666666667, 2.3918704710144927], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 2, 0, 0.0, 112.0, 103, 121, 112.0, 121.0, 121.0, 121.0, 4.366812227074235, 3.330547216157205, 2.123703602620087], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 2, 0, 0.0, 119.0, 118, 120, 119.0, 120.0, 120.0, 120.0, 6.493506493506494, 119.0137987012987, 10.200005073051948], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 2, 0, 0.0, 108.5, 80, 137, 108.5, 137.0, 137.0, 137.0, 4.597701149425287, 2.258441091954023, 2.2270114942528734], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, 100.0, 202.5, 179, 226, 202.5, 226.0, 226.0, 226.0, 3.875968992248062, 16.374454941860463, 2.395984738372093], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 2, 0, 0.0, 102.5, 91, 114, 102.5, 114.0, 114.0, 114.0, 6.211180124223602, 83.45970011645963, 9.574558423913043], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 2, 0, 0.0, 126.0, 115, 137, 126.0, 137.0, 137.0, 137.0, 4.065040650406504, 95.82817263719512, 6.079697027439025], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 2, 0, 0.0, 124.5, 115, 134, 124.5, 134.0, 134.0, 134.0, 3.9215686274509802, 117.76194852941177, 6.068091299019608], "isController": false}]}, function(index, item){
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
