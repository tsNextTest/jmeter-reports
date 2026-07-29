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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.84375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "3. POST /admin/api/v1/city/query"], "isController": false}, {"data": [1.0, 500, 1500, "4. POST /admin/api/v1/venue/query"], "isController": false}, {"data": [1.0, 500, 1500, "6. POST /admin/api/v1/show/query"], "isController": false}, {"data": [0.0, 500, 1500, "15. POST /admin/api/v1/service-fee/query"], "isController": false}, {"data": [0.75, 500, 1500, "1. POST /admin/api/v1/country/query"], "isController": false}, {"data": [1.0, 500, 1500, "36. POST /widget/api/v1/event/{eventId}/root-tickets"], "isController": false}, {"data": [1.0, 500, 1500, "5. POST /admin/api/v1/hall/query"], "isController": false}, {"data": [0.5, 500, 1500, "32. GET /widget/api/v1/show/{showId}"], "isController": false}, {"data": [1.0, 500, 1500, "33. POST /widget/api/v1/event/tabs/query"], "isController": false}, {"data": [1.0, 500, 1500, "34. POST /widget/api/v1/event/tabs/events/query"], "isController": false}, {"data": [0.5, 500, 1500, "7. POST /admin/api/v1/event/query"], "isController": false}, {"data": [1.0, 500, 1500, "13. POST /admin/api/v1/discount/query"], "isController": false}, {"data": [1.0, 500, 1500, "2. POST /admin/api/v1/state/query"], "isController": false}, {"data": [1.0, 500, 1500, "10. POST /admin/api/v1/root-ticket/query"], "isController": false}, {"data": [0.5, 500, 1500, "11. POST /admin/api/v1/ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "35. GET /widget/api/v1/event/{eventId}"], "isController": false}, {"data": [1.0, 500, 1500, "38. GET /widget/api/v1/event/{eventId}/tickets"], "isController": false}, {"data": [1.0, 500, 1500, "39. GET /widget/api/v1/cart/{cartId}"], "isController": false}, {"data": [1.0, 500, 1500, "14. POST /admin/api/v1/dealer-discount/query"], "isController": false}, {"data": [1.0, 500, 1500, "37. POST /widget/api/v1/cart"], "isController": false}, {"data": [0.0, 500, 1500, "40. POST /widget/api/v1/cart/{cartId}/root-ticket"], "isController": false}, {"data": [1.0, 500, 1500, "12. POST /admin/api/v1/quota/query"], "isController": false}, {"data": [1.0, 500, 1500, "9. POST /admin/api/v1/tariff/query"], "isController": false}, {"data": [1.0, 500, 1500, "8. POST /admin/api/v1/age-raiting/query"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48, 4, 8.333333333333334, 303.77083333333326, 95, 1070, 245.0, 724.7, 870.3499999999997, 1070.0, 9.556042205853077, 261.7856298526777, 11.384156318435199], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["3. POST /admin/api/v1/city/query", 2, 0, 0.0, 476.5, 473, 480, 476.5, 480.0, 480.0, 480.0, 4.166666666666667, 138.46028645833334, 6.394449869791667], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 2, 0, 0.0, 264.5, 261, 268, 264.5, 268.0, 268.0, 268.0, 7.462686567164179, 622.1650536380597, 11.438170475746269], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 2, 0, 0.0, 325.5, 317, 334, 325.5, 334.0, 334.0, 334.0, 5.970149253731344, 8.424673507462686, 9.558652052238806], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, 100.0, 99.5, 98, 101, 99.5, 101.0, 101.0, 101.0, 13.157894736842104, 11.140522203947368, 20.00025699013158], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 2, 0, 0.0, 698.5, 474, 923, 698.5, 923.0, 923.0, 923.0, 2.1668472372697725, 8.42086775460455, 3.2428646397616467], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 2, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 5.154639175257732, 6.896343427835052, 2.8944507087628866], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 2, 0, 0.0, 253.0, 252, 254, 253.0, 254.0, 254.0, 254.0, 7.874015748031496, 319.7973056102362, 12.28392593503937], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 2, 0, 0.0, 895.0, 720, 1070, 895.0, 1070.0, 1070.0, 1070.0, 1.7108639863130881, 1.7041809238665526, 0.8320412745936697], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 2, 0, 0.0, 189.5, 140, 239, 189.5, 239.0, 239.0, 239.0, 8.368200836820083, 5.213781380753138, 4.4946391213389125], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 2, 0, 0.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 15.267175572519083, 8.990338740458014, 9.243797709923664], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 2, 0, 0.0, 552.5, 538, 567, 552.5, 567.0, 567.0, 567.0, 3.527336860670194, 460.4276895943563, 5.416735559964727], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 2, 0, 0.0, 127.5, 119, 136, 127.5, 136.0, 136.0, 136.0, 9.47867298578199, 209.58604857819907, 14.824311315165877], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 2, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 8.16326530612245, 132.59725765306123, 12.535873724489797], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 2, 0, 0.0, 196.0, 142, 250, 196.0, 250.0, 250.0, 250.0, 5.649717514124294, 29.939640713276837, 9.608381885593221], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 2, 0, 0.0, 786.5, 767, 806, 786.5, 806.0, 806.0, 806.0, 2.2962112514351323, 513.0529743111366, 4.806571110792193], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 2, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 10.204081632653061, 17.149633290816325, 4.97249681122449], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 2, 0, 0.0, 121.5, 120, 123, 121.5, 123.0, 123.0, 123.0, 16.260162601626018, 6.867695630081301, 8.050685975609756], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 2, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 21.052631578947366, 16.05674342105263, 10.238486842105264], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 2, 0, 0.0, 305.0, 285, 325, 305.0, 325.0, 325.0, 325.0, 5.291005291005291, 96.97937334656085, 8.311115244708995], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 2, 0, 0.0, 122.5, 121, 124, 122.5, 124.0, 124.0, 124.0, 16.129032258064516, 7.922757056451613, 7.8125], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, 100.0, 392.5, 209, 576, 392.5, 576.0, 576.0, 576.0, 3.472222222222222, 14.665391710069446, 2.146402994791667], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 2, 0, 0.0, 109.0, 104, 114, 109.0, 114.0, 114.0, 114.0, 11.1731843575419, 150.14512046089385, 17.223507332402235], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 2, 0, 0.0, 214.5, 108, 321, 214.5, 321.0, 321.0, 321.0, 6.230529595015576, 146.87378309968847, 9.318414135514018], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 2, 0, 0.0, 106.0, 100, 112, 106.0, 112.0, 112.0, 112.0, 17.857142857142858, 536.2374441964286, 27.63148716517857], "isController": false}]}, function(index, item){
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
