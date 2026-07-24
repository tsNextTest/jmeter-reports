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

    var data = {"OkPercent": 17.073170731707318, "KoPercent": 82.92682926829268};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13414634146341464, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "17. POST /admin/api/v1/payment/query"], "isController": false}, {"data": [0.0, 500, 1500, "29. POST /admin/api/v1/notification/system/query"], "isController": false}, {"data": [0.0, 500, 1500, "3. POST /admin/api/v1/city/query"], "isController": false}, {"data": [0.0, 500, 1500, "6. POST /admin/api/v1/show/query"], "isController": false}, {"data": [0.0, 500, 1500, "16. POST /admin/api/v1/order/query"], "isController": false}, {"data": [0.0, 500, 1500, "1. POST /admin/api/v1/country/query"], "isController": false}, {"data": [0.5, 500, 1500, "36. POST /widget/api/v1/event/{eventId}/root-tickets"], "isController": false}, {"data": [0.0, 500, 1500, "20. POST /admin/api/v1/legalentity/query"], "isController": false}, {"data": [0.0, 500, 1500, "13. POST /admin/api/v1/discount/query"], "isController": false}, {"data": [0.0, 500, 1500, "11. POST /admin/api/v1/ticket/query"], "isController": false}, {"data": [0.0, 500, 1500, "38. GET /widget/api/v1/event/{eventId}/tickets"], "isController": false}, {"data": [0.0, 500, 1500, "26. POST /admin/api/v1/template-group/query"], "isController": false}, {"data": [0.0, 500, 1500, "28. POST /admin/api/v1/pushkaGateway/query"], "isController": false}, {"data": [0.0, 500, 1500, "23. POST /admin/api/v1/invitation/query"], "isController": false}, {"data": [0.0, 500, 1500, "27. POST /admin/api/v1/terminal/query"], "isController": false}, {"data": [1.0, 500, 1500, "37. POST /widget/api/v1/cart"], "isController": false}, {"data": [0.0, 500, 1500, "25. POST /admin/api/v1/paypoint/query"], "isController": false}, {"data": [0.0, 500, 1500, "12. POST /admin/api/v1/quota/query"], "isController": false}, {"data": [0.0, 500, 1500, "9. POST /admin/api/v1/tariff/query"], "isController": false}, {"data": [0.0, 500, 1500, "19. POST /admin/api/v1/customer/query"], "isController": false}, {"data": [0.0, 500, 1500, "22. POST /admin/api/v1/user/query"], "isController": false}, {"data": [0.0, 500, 1500, "8. POST /admin/api/v1/age-raiting/query"], "isController": false}, {"data": [0.0, 500, 1500, "24. POST /admin/api/v1/gateway/query"], "isController": false}, {"data": [0.0, 500, 1500, "4. POST /admin/api/v1/venue/query"], "isController": false}, {"data": [0.0, 500, 1500, "15. POST /admin/api/v1/service-fee/query"], "isController": false}, {"data": [0.0, 500, 1500, "21. POST /admin/api/v1/contract/query"], "isController": false}, {"data": [0.0, 500, 1500, "41. POST /widget/api/v1/cart/{cartId}/ticket"], "isController": false}, {"data": [0.0, 500, 1500, "5. POST /admin/api/v1/hall/query"], "isController": false}, {"data": [0.0, 500, 1500, "30. POST /admin/api/v1/sender-settings/query"], "isController": false}, {"data": [0.5, 500, 1500, "32. GET /widget/api/v1/show/{showId}"], "isController": false}, {"data": [1.0, 500, 1500, "33. POST /widget/api/v1/event/tabs/query"], "isController": false}, {"data": [0.0, 500, 1500, "7. POST /admin/api/v1/event/query"], "isController": false}, {"data": [1.0, 500, 1500, "34. POST /widget/api/v1/event/tabs/events/query"], "isController": false}, {"data": [0.0, 500, 1500, "2. POST /admin/api/v1/state/query"], "isController": false}, {"data": [0.0, 500, 1500, "10. POST /admin/api/v1/root-ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "35. GET /widget/api/v1/event/{eventId}"], "isController": false}, {"data": [0.5, 500, 1500, "39. GET /widget/api/v1/cart/{cartId}"], "isController": false}, {"data": [0.0, 500, 1500, "31. POST /admin/api/v1/progressbar/query"], "isController": false}, {"data": [0.0, 500, 1500, "42. POST /widget/api/v1/order"], "isController": false}, {"data": [0.0, 500, 1500, "14. POST /admin/api/v1/dealer-discount/query"], "isController": false}, {"data": [0.0, 500, 1500, "18. POST /admin/api/v1/cart/query"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41, 34, 82.92682926829268, 1640.9756097560976, 71, 60104, 101.0, 695.4000000000004, 813.0, 60104.0, 0.643248246756303, 0.5115772427399238, 0.8576694360987779], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 7.290377475247524, 16.176129331683168], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 1, 100.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 10.53587147887324, 21.388094190140848], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 7.190180759803922, 15.146292892156863], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 7.120373179611651, 15.643962378640778], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 7.1298543689320395, 17.028216019417478], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 1, 1, 100.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.9056926506765068, 1.853426737392374], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.925583707177814, 0.9112459216965743], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 7.257199754901961, 15.462239583333334], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 1, 100.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 7.373046875, 15.7421875], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 7.28070853960396, 20.82688737623762], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 1, 100.0, 60104.0, 60104, 60104, 60104.0, 60104.0, 60104.0, 60104.0, 0.016637827765206975, 0.012169661129042992, 0.008188930853187807], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 1, 100.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 9.174864969135802, 19.53125], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 1, 100.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 10.453345070422536, 21.305567781690144], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 1, 100.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 9.871199324324325, 21.378800675675677], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, 100.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 72.0, 13.888888888888888, 10.240342881944445, 22.379557291666668], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 2.299941588785047, 2.2497444509345796], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 1, 100.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 10.384573063380282, 22.172095070422536], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 7.199754901960785, 15.213311887254903], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 1, 1, 100.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 7.4277935606060606, 15.210700757575756], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 1, 100.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 7.373046875, 16.171875], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 1, 100.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 9.77882179054054, 20.98289695945946], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 7.257199754901961, 15.270756740196079], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 1, 100.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 10.086686643835616, 20.641588184931507], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 7.2710396039603955, 15.276918316831683], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, 100.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 7.40234375, 15.302734375], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 1, 100.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 6.411345108695652, 13.519021739130434], "isController": false}, {"data": ["41. POST /widget/api/v1/cart/{cartId}/ticket", 1, 1, 100.0, 120.0, 120, 120, 120.0, 120.0, 120.0, 120.0, 8.333333333333334, 8.235677083333334, 4.736328125], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 7.2613706683168315, 15.547648514851485], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 1, 100.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 10.193707191780822, 21.390732020547947], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.5765682656826568, 0.5945860239852399], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.7947635135135136, 1.804661106418919], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 7.2710396039603955, 15.305925123762375], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 5.249914461678832, 2.199047673357664], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 1, 1, 100.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 8.070054945054945, 16.98789491758242], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 7.1867415048543695, 16.61104368932039], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 29.258578431372552, 4.748774509803922], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 1.036574720670391, 0.6751374825418994], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 1, 100.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 9.752604166666668, 20.143229166666668], "isController": false}, {"data": ["42. POST /widget/api/v1/order", 1, 1, 100.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 1.8335015311804008, 1.739977728285078], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 7.224666262135923, 15.350045509708739], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 1, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 7.2613706683168315, 15.489634900990097], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 1, 2.9411764705882355, 2.4390243902439024], "isController": false}, {"data": ["504/Gateway Time-out", 1, 2.9411764705882355, 2.4390243902439024], "isController": false}, {"data": ["422/Unprocessable Entity", 1, 2.9411764705882355, 2.4390243902439024], "isController": false}, {"data": ["401/Unauthorized", 31, 91.17647058823529, 75.60975609756098], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41, 34, "401/Unauthorized", 31, "400/Bad Request", 1, "504/Gateway Time-out", 1, "422/Unprocessable Entity", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["41. POST /widget/api/v1/cart/{cartId}/ticket", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["42. POST /widget/api/v1/order", 1, 1, "422/Unprocessable Entity", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
