describe("GeneralController", function () {

    beforeEach(module("UHGroupingsApp"));
    beforeEach(module("ngMockE2E"));

    let scope;
    let controller;
    let httpBackend;
    let BASE_URL;

    beforeEach(inject(function ($rootScope, $controller, _BASE_URL_, _$httpBackend_) {
        scope = $rootScope.$new();
        controller = $controller("GeneralJsController", {
            $scope: scope
        });
        httpBackend = _$httpBackend_;
        BASE_URL = _BASE_URL_;
    }));

    it("should define the general controller", function () {
        expect(controller).toBeDefined();
    });

    it("should define the variables and methods in the table controller", function () {
        expect(scope.columnSort).toBeDefined();
        expect(scope.groupToPages).toBeDefined();
        expect(scope.filter).toBeDefined();
        expect(scope.pageRange).toBeDefined();
        expect(scope.setPage).toBeDefined();
        expect(scope.disableFirstAndPrev).toBeDefined();
        expect(scope.disableNextAndLast).toBeDefined();
        expect(scope.sortBy).toBeDefined();
    });

    describe("get current user and home page numbers: ", function () {
        let mockUser;
        let mockResponse;
        beforeEach(function () {
            mockUser = { username: "jdoe" };
            mockResponse = 999;
            httpBackend.whenGET(BASE_URL + "currentUser")
                .respond(200, mockUser);

            httpBackend.whenGET(BASE_URL + "members/memberships/")
                .respond(200, mockResponse);

            httpBackend.whenGET(BASE_URL + "owners/grouping/")
                .respond(200, mockResponse);
        });

        it("should make an API call to getCurrentUser", function () {
            httpBackend.expectGET(BASE_URL + "currentUser").respond(200, mockUser);
            expect(httpBackend.flush).not.toThrow();
        });

        it("should initialize currentUser", function () {
            httpBackend.expectGET(BASE_URL + "currentUser").respond(200, mockUser);
            httpBackend.flush();

            expect(scope.currentUser).toEqual("jdoe");
        });

        it("should make an API call to getNumberOfMembeships", function () {
            httpBackend.expectGET(BASE_URL + "members/memberships/").respond(200, mockResponse);
            expect(httpBackend.flush).not.toThrow();
        });

        it("should initialize numberOfMemberships", function () {
            httpBackend.expectGET(BASE_URL + "members/memberships/").respond(200, mockResponse);
            httpBackend.flush();

            expect(scope.numberOfMemberships).toEqual(999);
        });

        it("should make an API call to getNumberOfGroupings", function () {
            httpBackend.expectGET(BASE_URL + "owners/grouping/").respond(200, mockResponse);
            expect(httpBackend.flush).not.toThrow();
        });

        it("should initialize numberOfGroupings", function () {
            httpBackend.expectGET(BASE_URL + "owners/grouping/").respond(200, mockResponse);
            httpBackend.flush();

            expect(scope.numberOfGroupings).toEqual(999);
        });
    });

    // Set up mock data
    beforeEach(function () {
        scope.selectedGrouping = { name: "grouping1", path: "path:path2:grouping1" };
        scope.itemsPerPage = 20;

        scope.groupingBasis = [
            {
                name: "User One",
                username: "user1",
                uhUuid: "00000001",
                firstName: "User",
                lastName: "One"
            },
            {
                name: "User Four",
                username: "user4",
                uhUuid: "00000004",
                firstName: "User",
                lastName: "Four"
            },
            {
                name: "User Seven",
                username: "user7",
                uhUuid: "00000007",
                firstName: "User",
                lastName: "Seven"
            }
        ];
        scope.pagedItemsBasis = scope.groupToPages(scope.groupingBasis);

        scope.groupingInclude = [
            {
                name: "User One",
                username: "user1",
                uhUuid: "00000001",
                firstName: "User",
                lastName: "One"
            },
            {
                name: "User Two",
                username: "user2",
                uhUuid: "00000002",
                firstName: "User",
                lastName: "Two"
            },
            {
                name: "User Three",
                username: "user3",
                uhUuid: "00000003",
                firstName: "User",
                lastName: "Three"
            }
        ];
        scope.pagedItemsInclude = scope.groupToPages(scope.groupingInclude);

        scope.groupingExclude = [
            {
                name: "User Four",
                username: "user4",
                uhUuid: "00000004",
                firstName: "User",
                lastName: "Four"
            },
            {
                name: "User Five",
                username: "user5",
                uhUuid: "00000005",
                firstName: "User",
                lastName: "Five"
            },
            {
                name: "User Nine",
                username: "",
                uhUuid: "00000009",
                firstName: "User",
                lastName: "Nine"
            }
        ];
        scope.pagedItemsExclude = scope.groupToPages(scope.groupingExclude);

        scope.groupingMembers = _.cloneDeep(scope.groupingInclude);
        scope.groupingMembers.push({
            name: "User Seven",
            username: "user7",
            uhUuid: "00000007",
            firstName: "User",
            lastName: "Seven"
        });
        scope.pagedItemsMembers = scope.groupToPages(scope.groupingMembers);

        scope.groupingOwners = [
            {
                name: "User Six",
                username: "user6",
                uhUuid: "00000006",
                firstName: "User",
                lastName: "Six"
            }
        ];
        scope.pagedItemsOwners = scope.groupToPages(scope.groupingOwners);

        scope.listserv = true;
        scope.allowOptIn = true;
        scope.allowOptOut = true;
    });

    // For reference (in index order):
    // Members: User One, User Two, User Three, User Seven, User Eight
    // Basis: User One, User Four, User Seven
    // Include: User One, User Two, User Three
    // Exclude: User Four, User Five, User Nine
    // Owners: User Six
    describe("addInBasis", function () {
        it("should add a key called 'inBasis' for all members in the group passed", function () {
            scope.addInBasis(scope.groupingInclude);
            expect(_.has(scope.groupingInclude[0], "inBasis")).toBe(true);
            expect(_.has(scope.groupingInclude[1], "inBasis")).toBe(true);
            expect(_.has(scope.groupingInclude[2], "inBasis")).toBe(true);

            scope.addInBasis(scope.groupingExclude);
            expect(_.has(scope.groupingExclude[0], "inBasis")).toBe(true);
            expect(_.has(scope.groupingExclude[1], "inBasis")).toBe(true);
        });

        it("should have a value of 'Yes' for the 'inBasis' key if the member is in the basis group", function () {
            scope.addInBasis(scope.groupingInclude);
            expect(scope.groupingInclude[0].inBasis).toEqual("Yes");

            scope.addInBasis(scope.groupingExclude);
            expect(scope.groupingExclude[0].inBasis).toEqual("Yes");
        });

        it("should have a value of 'No' for the 'inBasis' key if the member is not in the basis group", function () {
            scope.addInBasis(scope.groupingInclude);
            expect(scope.groupingInclude[1].inBasis).toEqual("No");
            expect(scope.groupingInclude[2].inBasis).toEqual("No");

            scope.addInBasis(scope.groupingExclude);
            expect(scope.groupingExclude[1].inBasis).toEqual("No");
        });

    });

    describe("addWhereListed", function () {
        it("should add a key called 'whereListed' for all members in the grouping", function () {
            scope.addWhereListed(scope.groupingMembers);

            expect(_.has(scope.groupingMembers[0], "whereListed")).toBe(true);
            expect(_.has(scope.groupingMembers[1], "whereListed")).toBe(true);
            expect(_.has(scope.groupingMembers[2], "whereListed")).toBe(true);
        });

        it("should have a value of 'Basis' for the 'whereListed' key if the member is only in the basis group", function () {
            scope.addWhereListed(scope.groupingMembers);

            expect(scope.groupingMembers[3].whereListed).toEqual("Basis");
        });

        it("should have a value of 'Include' for the 'whereListed' key if the member is only in the include group", function () {
            scope.addWhereListed(scope.groupingMembers);

            expect(scope.groupingMembers[1].whereListed).toEqual("Include");
            expect(scope.groupingMembers[2].whereListed).toEqual("Include");
        });

        it("should have a value of 'Basis & Include' for the 'whereListed' key if the member is in both the basis and include group", function () {
            scope.addWhereListed(scope.groupingMembers);

            expect(scope.groupingMembers[0].whereListed).toEqual("Basis & Include");
        });
    });

    describe("sanitizer", () => {
        let goodFile, badFile, parseFile;
        beforeEach(() => {
            let bad1, bad2, bad3, bad4, bad5, bad6, bad7, bad8, bad9, bad10,bad11, bad12, bad13, bad14, bad15, bad16, bad17;
            bad1 = "<img src onerror=alert(\"Gavin is testing\")/>\n";
            bad2 = "'javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/\"/+/onmouseover=1/+/[*/[]/+alert(1)//'>\n'";
            bad3 = "<IMG SRC=\"javascript:alert('XSS');\">\n";
            bad4 = "<IMG SRC=javascript:alert('XSS')>\n";
            bad5 = "<IMG SRC=JaVaScRiPt:alert('XSS')>\n";bad6 = "<IMG SRC=javascript:alert(&quot;XSS&quot;)>\n";
            bad7 = "<IMG SRC=`javascript:alert(\"RSnake says, 'XSS'\")`>\n";
            bad8 = "\<a onmouseover=\"alert(document.cookie)\"\>xxs link\</a\>\n";
            bad9 = "\<a onmouseover=alert(document.cookie)\>xxs link\</a\>\n";
            bad10 = "<IMG>'<SCRIPT>alert('XSS')</SCRIPT>'\>";
            bad11 = "<img src=x onerror='&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041'>";
            bad12 = "<div id='init_data' style='display: none'>\n<%= html_encode(data.to_json) %>\n</div>\n";
            bad13 = "perl -e 'print '<IMG SRC=java\0script:alert(\'XSS\')>';' > out\n";
            bad14 = "<SCRIPT/XSS SRC='http://xss.rocks/xss.js'></SCRIPT>\n'";
            bad15 = "<BODY BACKGROUND=\'javascript:alert('XSS')\'>\\n";
            bad16 = "<STYLE>li {list-style-image: url(\'javascript:alert('XSS')\');}\\n";
            bad17 = "Set.constructor\`alert\x28document.domain\x29</STYLE><UL><LI>XSS</br>\n";


            goodFile = "wliang80\ngilbertz\nryotabs\nmhodges\nmairene\nchakhon\n26223772\n12345678\nbogusname\nfakename\n_1234455\n_gavin4\n_test_123-abc";
            badFile = `${bad1}${bad2}${bad3}${bad4}${bad5}${bad6}${bad7}${bad8}${bad9}${bad10}${bad11}${bad12}${bad13}${bad14}${bad15}${bad16}${bad17}`;
            parseFile = (file) => {
                scope.usersToAdd = file.split(/[\r\n]+/);
                let sanitizedFile = [];
                for (const users of scope.usersToAdd) {
                    let sanitizedName = scope.sanitizer(users);
                    if (sanitizedName != null) {
                        sanitizedFile.push(sanitizedName);
                    }
                }
                return sanitizedFile;
            };
        });

        it ("should return an empty array when given harmful input", () => {
            const arrayOfValidNames = parseFile(badFile);
            expect(arrayOfValidNames.length).toEqual(0);
            expect(arrayOfValidNames.toString()).toEqual("");
        });

        it("should return an array of usernames that match the definition of a uhuuid or a uid", () => {
            const arrayOfValidNames = parseFile(goodFile);
            expect(arrayOfValidNames.length).toEqual(13);
            expect(arrayOfValidNames.toString()).toEqual("wliang80,gilbertz,ryotabs,mhodges,mairene,chakhon,26223772,12345678,bogusname,fakename,_1234455,_gavin4,_test_123-abc");
        });

    });

    describe("validateAndAddUser", function () {
        describe("user adds 'validUser', who is a valid user and is not in any list, to the Include list", function () {
            const validUser = {
                name: "Valid User",
                username: "validUser",
                uhUuid: "00000010",
                firstName: "Valid",
                lastName: "User"
            };
            beforeEach(function () {
                scope.userToAdd = "validUser";
                httpBackend.whenGET(BASE_URL + "currentUser")
                    .respond(200);
                httpBackend.whenGET(BASE_URL + "members/memberships/")
                    .respond(200);
                httpBackend.whenGET(BASE_URL + "owners/grouping/")
                    .respond(200);
                httpBackend.whenGET(BASE_URL + "members/" + validUser.username)
                    .respond(200, validUser);
            });

            it("user should be validated", function () {
                spyOn(scope, "createConfirmAddModal").and.callThrough();
                scope.validateAndAddUser(validUser.username, "Include");
                httpBackend.expectGET(BASE_URL + "members/" + validUser.username)
                    .respond(200, validUser);

                expect(httpBackend.flush).not.toThrow();
                expect(scope.createConfirmAddModal).toHaveBeenCalled();
            });
        });

        describe("user adds 'invalidUser', who is not in the Grouper database", function () {
            const invalidUser = {
                name: null,
                username: null,
                uhUuid: null,
                firstName: null,
                lastName: null
            };
            beforeEach(function () {
                httpBackend.whenGET(BASE_URL + "currentUser")
                    .respond(200);
                httpBackend.whenGET(BASE_URL + "members/memberships/")
                    .respond(200);
                httpBackend.whenGET(BASE_URL + "owners/grouping/")
                    .respond(200);
                httpBackend.whenGET(BASE_URL + "members/" + "invalidUser")
                    .respond(200, invalidUser);
            });

            it("user should be invalidated", function () {
                spyOn(scope, "createCheckModal").and.callThrough();
                scope.validateAndAddUser("invalidUser","Include");
                httpBackend.expectGET(BASE_URL + "members/" + "invalidUser")
                    .respond(200, invalidUser);

                expect(httpBackend.flush).not.toThrow();
                expect(scope.resStatus).toEqual(404);
                expect(scope.createCheckModal).not.toHaveBeenCalled();
            });
        });
    });

    describe("addMember", function () {
        describe("user adds 'user8', who is not in any list, to the Include list", function () {
            beforeEach(function () {
                scope.userToAdd = "user8";
            });

            it("should create a confirmation modal to add the user", function () {
                spyOn(scope, "createConfirmAddModal").and.callThrough();
                scope.addMember("Include");

                expect(scope.createConfirmAddModal).toHaveBeenCalled();
            });

            it("should not create a modal asking if the user wants to remove 'user8' from a list", function () {
                spyOn(scope, "createCheckModal").and.callThrough();
                scope.addMember("Include");

                expect(scope.createCheckModal).not.toHaveBeenCalled();
            });
        });

        describe("user adds 'user1' to the Exclude list, who is currently in the Include list", function () {
            beforeEach(function () {
                scope.userToAdd = "user1";
            });

            /*
            it("should return true since 'user1' is currently in the Include list", function () {
                spyOn(scope, "isInAnotherList").and.callThrough();
                scope.addMember("Exclude");
                expect(scope.isInAnotherList).toHaveBeenCalled();
                expect(scope.isInAnotherList("user1", "Exclude")).toBe(true);
            });
             */

            it("should create a modal asking if the user wants to remove 'user1' from the Include list", function () {
                    spyOn(scope, "createCheckModal").and.callThrough();
                    scope.addMember("Exclude");
                    expect(scope.createCheckModal).toHaveBeenCalled();
                }
            );
        });

        describe("user tries to add a blank username to a list", function () {
            beforeEach(function () {
                scope.userToAdd = "";
            });

            it("should create an error message saying to enter a username", function () {
                spyOn(scope, "createConfirmAddModal").and.callThrough();
                scope.addMembers("Include");
                expect(scope.emptyInput).toBe(true);
                expect(scope.createConfirmAddModal).not.toHaveBeenCalled();
            });
        });

        describe("user tries to add 'user5', who is currently in the Exclude list, to the Exclude list", function () {
            beforeEach(function () {
                scope.userToAdd = "user5";
            });

            it("should create an error message saying the user already exists in the list", function () {
                spyOn(scope, "existInList").and.callThrough();
                scope.addMember("Include");
                expect(scope.existInList).toHaveBeenCalled();
                expect(scope.existInList("user5", "Exclude")).toBe(true);
            });
        });

        describe("user tries to add 'user7', who is currently in the Basis list, to the Include list", function () {
            beforeEach(function () {
                scope.userToAdd = "user7";
            });

            it("should create a modal asking if the user wants to add 'user7', who is in Basis, in the Include list", function () {
                spyOn(scope, "createBasisWarningModal").and.callThrough();
                let user = scope.userToAdd;
                scope.addMember("Include");
                expect(scope.createBasisWarningModal).toHaveBeenCalled();
            });
        });

        describe("user tries to add 'user8', who is currently not in the Basis list, to the Exclude list", function () {
            beforeEach(function () {
                scope.userToAdd = "user8";
            });

            it("should create a modal asking if the user wants to add 'user8', who not in Basis, in the Exclude list", function () {
                spyOn(scope, "createBasisWarningModal").and.callThrough();
                let user = scope.userToAdd;
                scope.addMember("Exclude");
                expect(scope.createBasisWarningModal).toHaveBeenCalled();
            });
        });
    });

    describe("isInAnotherList", function () {
        describe("user tries to add 'user1', who is currently in the Include list, to the Exclude list", function () {
            beforeEach(function () {
                scope.userToAdd = "user1";
            });
            it("should return true since 'user1' is currently in the Include list", function () {
                spyOn(scope, "isInAnotherList").and.callThrough();
                scope.addMember("Exclude");

                //  expect(scope.isInAnotherList).toHaveBeenCalled();
                expect(scope.isInAnotherList("user1", "Exclude")).toBe(true);
            });
        });
        describe("user tries to add 'user5', who is currently in the Exclude list, to the Include list", function () {
            beforeEach(function () {
                scope.userToAdd = "user5";
            });
            it("should return true since 'user5' is currently in the Exclude list", function () {
                spyOn(scope, "isInAnotherList").and.callThrough();
                scope.addMember("Include");

                // expect(scope.isInAnotherList).toHaveBeenCalled();
                expect(scope.isInAnotherList("user5", "Include")).toBe(true);
            });
        });
        describe("user tries to add 'user8', who is not in any list", function () {
            beforeEach(function () {
                scope.userToAdd = "user8";
            });
            it("should return false if the user tries to add 'user8' to the Include list", function () {
                spyOn(scope, "isInAnotherList").and.callThrough();
                scope.addMember("Include");

                //expect(scope.isInAnotherList).not.toHaveBeenCalled();
                expect(scope.isInAnotherList("user8", "Include")).toBe(false);
            });
            it("should return false if the user tries to add 'user8' to the Exclude list", function () {
                spyOn(scope, "isInAnotherList").and.callThrough();
                scope.addMember("Exclude");

                //expect(scope.isInAnotherList).not.toHaveBeenCalled();
                expect(scope.isInAnotherList("user8", "Exclude")).toBe(false);
            });

        });
    });

    describe("existInList", function () {
        describe("user tries to add 'user5', who is currently in the Exclude list, to the Exclude list", function () {
            it("should return true since user5 is being added to the same list", function () {
                expect(scope.existInList("user5", "Exclude")).toBe(true);
            });
        });

        describe("user tries to add 'user1', who is currently in the Include list, to the Include list", function () {
            it("should return true since user1 is being added ot the same list", function () {
                expect(scope.existInList("user1", "Include")).toBe(true);
            });
        });

        describe("user tries to add 'user8', who is not in any list", function () {
            it("should return false if trying the user tries to add 'user8' to the Include list", function () {
                expect(scope.existInList("user8", "Include")).toBe(false);
            });

            it("should return false if trying the user tries to add 'user8' to the Exclude list", function () {
                expect(scope.existInList("user8", "Exclude")).toBe(false);
            });
        });

        describe("user tries to add 'user2', who is currently in the Include list, to the Exclude list", function () {
            it("should return false since 'user2' is not being added to the same list", function () {
                expect(scope.existInList("user2", "Exclude")).toBe(false);
            });
        });

        describe("user tries to add 'user4', who is currently in the Exclude list, to the Include list", function () {
            it("should return false since 'user4' is not being added to the same list", function () {
                expect(scope.existInList("user4", "Include")).toBe(false);
            });
        });

    });

    describe("returnToGroupingsList", function () {
        it("should call resetGroupingInformation", function () {
            spyOn(scope, "resetGroupingInformation").and.callThrough();
            scope.returnToGroupingsList();

            expect(scope.resetGroupingInformation).toHaveBeenCalled();
        });

        it("should reset scope.columnSort to a blank object", function () {
            scope.returnToGroupingsList();

            expect(scope.columnSort).toEqual({});
        });

        it("should go back to the groupings list view", function () {
            scope.returnToGroupingsList();

            expect(scope.showGrouping).toBe(false);
        });
    });

    describe("resetGroupingInformation", function () {
        it("should reset every nonpaginated list pertaining to a grouping", function () {
            scope.resetGroupingInformation();

            expect(scope.groupingMembers).toEqual([]);
            expect(scope.groupingBasis).toEqual([]);
            expect(scope.groupingInclude).toEqual([]);
            expect(scope.groupingExclude).toEqual([]);
            expect(scope.groupingOwners).toEqual([]);
        });

        it("should reset every paginated list pertaining to a grouping", function () {
            scope.resetGroupingInformation();

            expect(scope.pagedItemsMembers).toEqual([]);
            expect(scope.pagedItemsBasis).toEqual([]);
            expect(scope.pagedItemsInclude).toEqual([]);
            expect(scope.pagedItemsExclude).toEqual([]);
            expect(scope.pagedItemsOwners).toEqual([]);
        });

        it("should reset all page numbers for lists pertaining to a grouping", function () {
            scope.resetGroupingInformation();

            expect(scope.currentPageMembers).toEqual(0);
            expect(scope.currentPageBasis).toEqual(0);
            expect(scope.currentPageInclude).toEqual(0);
            expect(scope.currentPageExclude).toEqual(0);
            expect(scope.currentPageOwners).toEqual(0);
        });

        it("should reset all search filters", function () {
            scope.resetGroupingInformation();

            expect(scope.basisQuery).toEqual("");
            expect(scope.excludeQuery).toEqual("");
            expect(scope.includeQuery).toEqual("");
            expect(scope.membersQuery).toEqual("");
            expect(scope.adminsQuery).toEqual("");
            expect(scope.optInQuery).toEqual("");
            expect(scope.ownersQuery).toEqual("");
            expect(scope.personQuery).toEqual("");
        });
    });

    describe("getPersonProps", function () {
        beforeEach(function () {
            scope.personProps = "";
        });
        describe("get and modify person props", function () {
            it("should return all the user's attributes", function () {
                let propsArray = Object.keys(scope.groupingBasis[0]);
                expect(propsArray).toEqual(["name", "username", "uhUuid", "firstName", "lastName"]);
            });
            it("should return a list with only the user's username, uhUuid, and name", function () {
                spyOn(scope, "getPersonProps").and.callThrough();
                let propsArray = Object.keys(scope.groupingBasis[0]);
                scope.getPersonProps(propsArray);
                expect(propsArray).not.toEqual(["name", "username", "uhUuid", "firstName", "lastName"]);
                expect(scope.personProps).toEqual([["username"], ["uhUuid"], ["name"]]);
            });
        });
    });

    describe("convertListToCsv", function () {
        describe("user exports a list with members", function () {
            it("should start with the correct column headers", function () {
                const csv = scope.convertListToCsv(scope.groupingExclude);

                expect(csv.indexOf("Last,First,Username,UH Number,Email\r\n")).toEqual(0);
            });

            it("should contain the information of every member in the list", function () {
                const csv = scope.convertListToCsv(scope.groupingExclude);

                expect(csv).toContain("Four,User,user4,00000004,user4@hawaii.edu");
                expect(csv).toContain("Five,User,user5,00000005,user5@hawaii.edu");
                expect(csv).toContain("Nine,User,,00000009,\r\n");
            });
        });

    });

    describe("showWarningRemovingSelf", function () {
        describe("removing self from a list", function () {
            beforeEach(function () {
                scope.currentUser = "jdoe";
                scope.userToRemove = {
                    username: "jdoe",
                    name: "John Doe",
                    uhUuid: "12345678"
                };
            });

            it("should warn the user if removing from the owners list", function () {
                scope.listName = "owners";
                expect(scope.showWarningRemovingSelf()).toBe(true);
            });

            it("should warn the user if removing from the admins list", function () {
                scope.listName = "admins";
                expect(scope.showWarningRemovingSelf()).toBe(true);
            });

            it("should not warn the user if removing from the Include list", function () {
                scope.listName = "Include";
                expect(scope.showWarningRemovingSelf()).toBe(false);
            });

            it("should not warn the user if removing from the Exclude list", function () {
                scope.listName = "Exclude";
                expect(scope.showWarningRemovingSelf()).toBe(false);
            });
        });

    });
    describe("parseAddRemoveInputStr", function () {
        let spaceSeparated = "Hello I love you";
        let commaSeparated = "Hello,I,love,you";
        let commaAndSpaceSeparated = "Hello, I love,you";
        let single = "Hello";

        it("should take a space separated string and replace the spaces with ','", function () {
            expect(scope.parseAddRemoveInputStr(spaceSeparated)).toEqual(commaSeparated);
        });
        it("should take a comma separated string and do nothing", function () {
            expect(scope.parseAddRemoveInputStr(commaSeparated)).toEqual(commaSeparated);
        });
        it("should take a comma and space separated string and replace the spaces amd commas with ','", function () {
            expect(scope.parseAddRemoveInputStr(commaAndSpaceSeparated)).toEqual(commaSeparated);
        });
        it("should do nothing with a string that has no commas or spaces", function () {
            expect(scope.parseAddRemoveInputStr(single)).toEqual(single);
        });
        it("should return an empty string if value passed is not a string", function () {
            expect(scope.parseAddRemoveInputStr(true)).toEqual("");

        });
    });

    describe("extractSelectedUsersFromCheckboxes", function () {
        let obj = {};
        let str = "test";
        let expectedResult = "";
        for (let i = 0; i < 10; i++) {
            let ident = str + i.toString();
            let val = Boolean(i % 2);
            obj[ident] = val;
            if (val) {
                expectedResult += ident + ",";
            }
        }
        expectedResult = expectedResult.slice(0, -1);

        it("should create a comma separated string of all object identifiers set to true", function () {
            expect(scope.extractSelectedUsersFromCheckboxes(obj)).toEqual(expectedResult);
        });
        it("should return an empty string if object contains anything but boolean values", function () {
            expect(scope.extractSelectedUsersFromCheckboxes({ test1: "test1", test2: true, test3: false })).toEqual("");
        });
    });
});
