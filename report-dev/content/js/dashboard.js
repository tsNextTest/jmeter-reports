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
    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48, 4, 8.333333333333334, 181.45833333333331, 61, 456, 144.5, 376.70000000000005, 432.4999999999999, 456.0, 15.242934264845983, 424.34292136392503, 18.158976560019052], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["3. POST /admin/api/v1/city/query", 2, 0, 0.0, 182.0, 178, 186, 182.0, 186.0, 186.0, 186.0, 4.842615012106537, 160.91290859564165, 7.431806144067797], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 2, 0, 0.0, 208.5, 195, 222, 208.5, 222.0, 222.0, 222.0, 4.750593824228028, 396.0529245843231, 7.281305671021378], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 2, 0, 0.0, 194.5, 161, 228, 194.5, 228.0, 228.0, 228.0, 4.773269689737471, 6.7333867840095465, 7.642359039379476], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, 100.0, 100.0, 90, 110, 100.0, 110.0, 110.0, 110.0, 18.18181818181818, 15.394176136363637, 27.63671875], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 2, 0, 0.0, 351.0, 256, 446, 351.0, 446.0, 446.0, 446.0, 2.8328611898017, 11.00776823654391, 4.23960915368272], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 2, 0, 0.0, 171.5, 141, 202, 171.5, 202.0, 202.0, 202.0, 4.854368932038835, 6.496984981796117, 2.7258419296116507], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 2, 0, 0.0, 140.0, 136, 144, 140.0, 144.0, 144.0, 144.0, 5.970149253731344, 242.47318097014923, 9.313782649253731], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 2, 0, 0.0, 372.0, 288, 456, 372.0, 456.0, 456.0, 456.0, 2.7063599458728014, 2.6971096921515563, 1.316178958051421], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 2, 0, 0.0, 107.5, 94, 121, 107.5, 121.0, 121.0, 121.0, 5.305039787798409, 3.1239638594164454, 2.8493866047745358], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 2, 0, 0.0, 172.5, 159, 186, 172.5, 186.0, 186.0, 186.0, 4.535147392290249, 4.656940901360544, 2.745890022675737], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 2, 0, 0.0, 368.0, 335, 401, 368.0, 401.0, 401.0, 401.0, 3.3670033670033668, 439.4876499368687, 5.170520307239057], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 2, 0, 0.0, 149.5, 102, 197, 149.5, 197.0, 197.0, 197.0, 8.064516129032258, 178.32110005040323, 12.61261970766129], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 2, 0, 0.0, 187.5, 175, 200, 187.5, 200.0, 200.0, 200.0, 4.597701149425287, 74.68121408045977, 7.060434626436781], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 2, 0, 0.0, 139.0, 136, 142, 139.0, 142.0, 142.0, 142.0, 6.7114093959731544, 35.56260486577181, 11.41398385067114], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 2, 0, 0.0, 395.0, 374, 416, 395.0, 416.0, 416.0, 416.0, 3.7593984962406015, 839.9759163533835, 7.869404957706767], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 2, 0, 0.0, 109.0, 104, 114, 109.0, 114.0, 114.0, 114.0, 5.194805194805195, 8.72564935064935, 2.531452922077922], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 2, 0, 0.0, 84.0, 61, 107, 84.0, 107.0, 107.0, 107.0, 7.8125, 3.299713134765625, 3.86810302734375], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 2, 0, 0.0, 110.0, 95, 125, 110.0, 125.0, 125.0, 125.0, 8.264462809917356, 6.303267045454546, 4.019240702479339], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 2, 0, 0.0, 146.5, 131, 162, 146.5, 162.0, 162.0, 162.0, 10.989010989010989, 201.40796703296704, 17.261547046703296], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 2, 0, 0.0, 102.5, 95, 110, 102.5, 110.0, 110.0, 110.0, 6.5359477124183005, 3.2041462418300655, 3.1658496732026142], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, 100.0, 211.5, 182, 241, 211.5, 241.0, 241.0, 241.0, 6.688963210702341, 96.882185409699, 4.134876672240803], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 2, 0, 0.0, 129.5, 114, 145, 129.5, 145.0, 145.0, 145.0, 7.6923076923076925, 103.369140625, 11.85772235576923], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 2, 0, 0.0, 112.0, 100, 124, 112.0, 124.0, 124.0, 124.0, 6.968641114982578, 164.2768673780488, 10.422337761324043], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 2, 0, 0.0, 111.5, 110, 113, 111.5, 113.0, 113.0, 113.0, 6.622516556291391, 198.86304842715234, 10.247438948675496], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 3, 75.0, 6.25], "isController": false}, {"data": ["422/Unprocessable Entity", 1, 25.0, 2.0833333333333335], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 48, 4, "500/Internal Server Error", 3, "422/Unprocessable Entity", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, "500/Internal Server Error", 1, "422/Unprocessable Entity", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
