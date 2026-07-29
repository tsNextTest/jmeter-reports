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

    var data = {"OkPercent": 87.8048780487805, "KoPercent": 12.195121951219512};
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41, 5, 12.195121951219512, 159.14634146341461, 91, 434, 131.0, 285.60000000000025, 415.3999999999999, 434.0, 8.348605172062717, 313.60084504174307, 11.054385244858482], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 8.272058823529413, 15.883501838235295], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 0, 0.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 25.038710585585584, 13.557502815315315], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 159.19971955128204, 8.764022435897436], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 6.937135686528498, 2.9094478626943006], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1475.7527669270835, 6.514485677083334], "isController": false}, {"data": ["07. POST /admin/api/v1/event/query", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 308.9130998222749, 3.630868631516588], "isController": false}, {"data": ["02. POST /admin/api/v1/state/query", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 88.26745074728261, 8.327318274456522], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 329.4393209586466, 11.73343515037594], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 752.3049505471381, 7.036510942760943], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 4.7641647196261685, 4.627263434579439], "isController": false}, {"data": ["09. POST /admin/api/v1/tariff/query", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 348.64169034090907, 13.565340909090908], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 0, 0.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 174.96304898648648, 14.12936373873874], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 6.438078703703704, 13.879846643518519], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 503.85298295454544, 14.2578125], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 8.281632965686274, 15.663296568627452], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 1, 0, 0.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 4.234577047413793, 4.175646551724138], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 487.84250452898544, 11.308310688405797], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 1, 1, 100.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 22.591493983957218, 3.3056901737967914], "isController": false}, {"data": ["04. POST /admin/api/v1/venue/query", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 458.07220123626377, 8.402730082417582], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 270.0892857142857, 15.694754464285714], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 0, 0.0, 126.0, 126, 126, 126.0, 126.0, 126.0, 126.0, 7.936507936507936, 458.0078125, 12.726314484126984], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 0, 0.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 251.61082474226802, 15.866623711340205], "isController": false}, {"data": ["06. POST /admin/api/v1/show/query", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 10.218523550724637, 11.577219202898549], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 313.4128736413043, 10.820029438405797], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, 100.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 9.314903846153847, 16.665951236263737], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 304.6153402093596, 7.591209975369457], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 0, 0.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 374.7336647727273, 10.824136800699302], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 2.2973970334101383, 1.1205717165898617], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 1, 0, 0.0, 139.0, 139, 139, 139.0, 139.0, 139.0, 139.0, 7.194244604316547, 4.236454586330935, 3.8640962230215825], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 1, 0, 0.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 9.163992745535714, 5.405970982142857], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 1, 1, 100.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 217.79563210227272, 5.940755208333333], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 0, 0.0, 130.0, 130, 130, 130.0, 130.0, 130.0, 130.0, 7.6923076923076925, 40.74519230769231, 13.055889423076923], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 1, 0, 0.0, 124.0, 124, 124, 124.0, 124.0, 124.0, 124.0, 8.064516129032258, 13.545866935483872, 3.929876512096774], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 7.713857323232323, 4.912405303030303], "isController": false}, {"data": ["01. POST /admin/api/v1/country/query", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 10.915006144662922, 4.194281074438202], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 115.19752358490567, 14.12330483490566], "isController": false}, {"data": ["08. POST /admin/api/v1/age-raiting/query", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 278.0490451388889, 14.295789930555555], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 0, 0.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 274.10842080152673, 11.96475429389313], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 0, 0.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 8.091517857142858, 13.846261160714285], "isController": false}, {"data": ["05. POST /admin/api/v1/hall/query", 1, 0, 0.0, 153.0, 153, 153, 153.0, 153.0, 153.0, 153.0, 6.5359477124183005, 265.45266544117646, 10.174121732026144], "isController": false}, {"data": ["03. POST /admin/api/v1/city/query", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 160.52894776570048, 7.397342995169082], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 4, 80.0, 9.75609756097561], "isController": false}, {"data": ["422/Unprocessable Entity", 1, 20.0, 2.4390243902439024], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41, 5, "500/Internal Server Error", 4, "422/Unprocessable Entity", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 1, 1, "422/Unprocessable Entity", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
