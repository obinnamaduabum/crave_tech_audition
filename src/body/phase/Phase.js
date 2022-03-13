import React, {Component} from "react";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export class Phase extends Component {

    _isMounted = false;

    constructor(props, context) {
        super(props, context);
        this.state = {
            formControls: {
                name: {
                    value: '',
                    placeholder: 'Enter name',
                    valid: false,
                    touched: false,
                    validationRules: {
                        required: {
                            state: true,
                            message: "Name required"
                        },
                    }
                }
            }
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.checkIfPhaseAlreadyExists = this.checkIfPhaseAlreadyExists.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        const taskList = localStorage.getItem("taskList");
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleBlur = (field) => event => {
        console.log(field);

        if (this._isMounted) {
            this.setState(previousState => ({
                formControls: {
                    ...previousState.formControls,
                    [field]: {
                        ...previousState.formControls[field],
                        touched: true
                    }
                }
            }));
        }

        // setTimeout(() => {
        //     console.log(this.state.formControls[field]);
        // }, 1000);
    };

    changeHandler = (field) => event => {

        event.persist();

        const value = event.target.value;

        if (this._isMounted) {
            this.setState(previousState => ({
                formControls: {
                    ...previousState.formControls,
                    [field]: {
                        ...previousState.formControls[field],
                        value: value
                    }
                }
            }));
        }

        if (value) {

            if (this.state.formControls[field].validationRules.required) {

                if (this.state.formControls[field].validationRules.required.state) {

                    if (value) {

                        if (this._isMounted) {
                            this.setState(previousState => ({
                                formControls: {
                                    ...previousState.formControls,
                                    [field]: {
                                        ...previousState.formControls[field],
                                        valid: true
                                    }
                                }
                            }));
                        }
                    }

                } else {

                    if (this._isMounted) {
                        this.setState(previousState => ({
                            formControls: {
                                ...previousState.formControls,
                                [field]: {
                                    ...previousState.formControls[field],
                                    valid: false
                                }
                            }
                        }));
                    }
                }
            }
        } else {
            if (this.state.formControls[field].validationRules.required) {

                if (!this.state.formControls[field].validationRules.required.state) {

                    if (this._isMounted) {
                        this.setState(previousState => ({
                            formControls: {
                                ...previousState.formControls,
                                [field]: {
                                    ...previousState.formControls[field],
                                    value: '',
                                    valid: true
                                }
                            }
                        }));
                    }
                }
            }
        }
    }

    notifyFailed(errorMessage) {
        toast.error(errorMessage, {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    notifySuccess(message) {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    doFormSubmit = event => {

        event.preventDefault();

        let errors = [];
        let errorMessage = "";

        if (!this.state.formControls.name.valid) {
            errors.push('true');
            errorMessage = "Name required";
        }

        if (errors.length > 0) {
            this.notifyFailed(errorMessage);

            if (this.state.formControls.name.value.length <= 0) {

                if (this._isMounted) {
                    this.setState(previousState => ({
                        formControls: {
                            name: {
                                ...previousState.formControls.name,
                                valid: false,
                                touched: true
                            }
                        }
                    }));
                }
            }

        } else {

            let arr;
            const taskList = localStorage.getItem("taskList");
            if (taskList.length > 0) {
                arr = JSON.parse(taskList);
            } else {
                arr = [];
            }


            const input = {
                phase: {
                    name: this.state.formControls.name.value,
                    unlocked: arr.length <= 0,
                    successful: false,
                    tasks: []
                },
            };

            if (this.checkIfPhaseAlreadyExists(this.state.formControls.name.value, arr)) {
                this.notifyFailed(`Phase already exists!`);
            } else {
                arr.push(input);
                localStorage.setItem("taskList", JSON.stringify(arr));
                this.notifySuccess(`The phase "${this.state.formControls.name.value}" has been added`);
                this.makeFormPristine('name');
                setTimeout(()=> {
                    window.location.reload();
                }, 10);
            }
        }
    };


    makeFormPristine(field) {
        if (this._isMounted) {
            this.setState(previousState => ({
                formControls: {
                    ...previousState.formControls,
                    [field]: {
                        ...previousState.formControls[field],
                        valid: false,
                        touched: false,
                        value: ''
                    }
                }
            }));
        }
    }


    checkIfPhaseAlreadyExists(name, arr) {
        const result = arr.filter((data) => {
            return data.phase.name.toLowerCase() === name.toLowerCase();
        });

        if (result) {
            return result.length > 0;
        }

        return false;
    }

    // Todo show list of phases in a list to the users

    render() {
        return (
            <div>

                <ToastContainer autoClose={false}/>

                <h3>Add Phase</h3>


                <div className="input-group">
                    <input type={'text'}
                           className={"form-control"}
                           value={this.state.formControls.name.value}
                           onChange={this.changeHandler('name')}
                           onFocus={this.handleBlur('name')}
                           placeholder={this.state.formControls.name.placeholder}
                    />
                </div>

                <div className={'text-error text-error-font-size'}>
                    {
                        (() => {
                                if (this.state.formControls.name.touched && !this.state.formControls.name.valid) {
                                    if (!this.state.formControls.name.value) {
                                        if (this.state.formControls.name.validationRules.required.state) {
                                            return <span> {this.state.formControls.name.validationRules.required.message} </span>;
                                        }
                                    }
                                }
                            }
                        )()
                    }
                </div>

                <div className={'space'}/>
                <button type="button"
                        onClick={this.doFormSubmit}
                        className="btn btn-primary btn-lg">Add
                </button>
            </div>
        );
    }
}
