# CODING CONVENTIONS

We are BIG MANIACs of coding conventions. Make sure you apply them or you're out. (no kidding).

We follow these conventions: [http://nodeguide.com/style.html](http://nodeguide.com/style.html)

*Small exception: we prefer 4 spaces indentation instead of 2*


## Rules

    /****************************************
     * CSS
     ***************************************/

    #container
    // -> NOT #Container #cntnr
    .button-small
    // -> NOT .buttonSmall

    // + use variables and bs mixins as much as you can


    /****************************************
     * JS
     ***************************************/

    // tabs
    tabs = 4 spaces

    // variable names
    var myVariable = ***;
    var MyClass = ***;
    var myInstance = new MyClass();
    this._myPrivateVariable = ***;
    this._myPrivateFunction = ***;
    var MY_CONSTANT = ***;

    // class definition
    var User = function(username, password) {
        this.username = username;
        this.password = password;
    }
    User.prototype.getHello = function(toUser) {
        return 'Hello {0}, my name is {1}'.format(this.username, toUser.username);
    }

    // class inheritance
    var Employee = function(username, password, company) {
        // parent constructor call
        User.call(this, username, password);
        // child impl
        this.company = company;
    }
    // actual inheritance declaration
    Employee.prototype = new User();
    // method overriding
    Employee.prototype.getHello = function(toUser) {
        var hello = User.prototype.getHello.call(this, toUser);
        return '{0}, I am from {1}'.format(hello, this.company);
    }


    /****************************************
     * JSON, MongoDB
     ***************************************/

    // database names are lowercase words
    user

    // all variables are underscored
    user {
        _companyId: ObjectID('XXX'), // xref key
        status: 'XXX',
        aSuperKey: 'XXX',
        subDoc: {
            ...
        }
    }