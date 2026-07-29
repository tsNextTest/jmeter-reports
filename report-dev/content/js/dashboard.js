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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48, 4, 8.333333333333334, 196.81249999999997, 62, 567, 172.5, 357.7000000000001, 500.0999999999998, 567.0, 13.856812933025404, 385.7049743793303, 16.507683945583143], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["3. POST /admin/api/v1/city/query", 2, 0, 0.0, 241.0, 218, 264, 241.0, 264.0, 264.0, 264.0, 4.158004158004158, 138.17039695945945, 6.381155795218295], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 2, 0, 0.0, 218.0, 194, 242, 218.0, 242.0, 242.0, 242.0, 4.854368932038835, 404.7045661407767, 7.440363319174757], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 2, 0, 0.0, 200.5, 183, 218, 200.5, 218.0, 218.0, 218.0, 4.807692307692308, 6.777249849759616, 7.697472205528847], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, 100.0, 97.5, 96, 99, 97.5, 99.0, 99.0, 99.0, 5.4945054945054945, 4.657451923076923, 8.351755666208792], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 2, 0, 0.0, 390.0, 314, 466, 390.0, 466.0, 466.0, 466.0, 2.6212319790301444, 10.185431684141546, 3.9228886795543905], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 2, 0, 0.0, 208.0, 205, 211, 208.0, 211.0, 211.0, 211.0, 3.236245954692557, 4.331323321197411, 1.8172279530744337], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 2, 0, 0.0, 180.0, 165, 195, 180.0, 195.0, 195.0, 195.0, 5.5096418732782375, 223.76732524104685, 8.595364152892563], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 2, 0, 0.0, 421.0, 314, 528, 421.0, 528.0, 528.0, 528.0, 2.6212319790301444, 2.6109927916120577, 1.2747788335517694], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 2, 0, 0.0, 142.0, 109, 175, 142.0, 175.0, 175.0, 175.0, 4.878048780487805, 2.8725228658536586, 2.620045731707317], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 2, 0, 0.0, 169.5, 128, 211, 169.5, 211.0, 211.0, 211.0, 3.9138943248532287, 4.01709271037182, 2.3697407045009786], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 2, 0, 0.0, 392.5, 349, 436, 392.5, 436.0, 436.0, 436.0, 3.4364261168384878, 448.54925096649487, 5.277128973367698], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 2, 0, 0.0, 112.0, 93, 131, 112.0, 131.0, 131.0, 131.0, 5.6657223796034, 125.27111366855524, 8.860990616147308], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 2, 0, 0.0, 251.0, 234, 268, 251.0, 268.0, 268.0, 268.0, 3.766478342749529, 61.175847457627114, 5.783971869114877], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 2, 0, 0.0, 151.5, 146, 157, 151.5, 157.0, 157.0, 157.0, 6.7114093959731544, 35.56260486577181, 11.41398385067114], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 2, 0, 0.0, 397.5, 228, 567, 397.5, 567.0, 567.0, 567.0, 3.527336860670194, 788.1272734788361, 7.38363921957672], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 2, 0, 0.0, 185.0, 170, 200, 185.0, 200.0, 200.0, 200.0, 3.4305317324185247, 5.762221269296742, 1.671714193825043], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 2, 0, 0.0, 70.0, 62, 78, 70.0, 78.0, 78.0, 78.0, 5.698005698005698, 1.9197382478632479, 2.821180555555556], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 2, 0, 0.0, 126.5, 102, 151, 126.5, 151.0, 151.0, 151.0, 5.333333333333333, 4.065104166666667, 2.59375], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 2, 0, 0.0, 126.5, 123, 130, 126.5, 130.0, 130.0, 130.0, 5.128205128205129, 93.99038461538461, 8.055388621794872], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 2, 0, 0.0, 140.0, 80, 200, 140.0, 200.0, 200.0, 200.0, 4.0983606557377055, 2.0131595799180326, 1.9851434426229508], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, 100.0, 168.0, 146, 190, 168.0, 190.0, 190.0, 190.0, 5.405405405405405, 78.2912795608108, 3.341427364864865], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 2, 0, 0.0, 106.0, 94, 118, 106.0, 118.0, 118.0, 118.0, 6.329113924050633, 85.04437796677215, 9.756353837025316], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 2, 0, 0.0, 119.5, 119, 120, 119.5, 120.0, 120.0, 120.0, 7.380073800738007, 173.97587061808116, 11.037678736162361], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 2, 0, 0.0, 110.0, 107, 113, 110.0, 113.0, 113.0, 113.0, 7.722007722007723, 231.88646235521236, 11.948751206563706], "isController": false}]}, function(index, item){
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
