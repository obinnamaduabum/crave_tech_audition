import React, {Component} from "react";
import {toast} from "react-toastify";

export class TaskList extends Component {

    _isMounted = false;
    listOfOptions = [];

    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedOption: '',
            formControls: {
                phase: {
                    value: '0',
                    placeholder: 'Select phase name',
                    valid: false,
                    touched: false,
                    validationRules: {
                        required: {
                            state: true,
                            message: "Phase name required"
                        },
                    }
                },
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
        this.handleChange = this.handleChange.bind(this);
        this.doFormSubmit = this.doFormSubmit.bind(this);
        const listOfOptions = JSON.parse(localStorage.getItem('taskList'));
        console.log(listOfOptions);
        if(listOfOptions.length > 0) {
            this.listOfOptions = listOfOptions;
        }
    }

    componentDidMount() {
        this._isMounted = true;
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

    doFormSubmit = event => {

        event.preventDefault();

        let errors = [];
        let errorMessage = "";


        if (!this.state.formControls.name.valid) {
            errors.push('true');
            errorMessage = "Name required";
        }

        if (this.state.formControls.phase.value === '0') {
            // console.log('ca')
            errors.push('true');
            errorMessage = "Phase required";
            // console.log(errorMessage);
        }

        if (errors.length > 0) {

            this.notifyFailed(errorMessage);

            if (this.state.formControls.name.value.length <= 0) {

                if (this._isMounted) {
                    this.setState(previousState => ({
                        formControls: {
                            ...previousState.formControls,
                            name: {
                                ...previousState.formControls.name,
                                valid: false,
                                touched: true
                            },

                        }
                    }));
                }
            }

            if (this.state.formControls.phase.value === '0') {

                if (this._isMounted) {
                    this.setState(previousState => ({
                        formControls: {
                            ...previousState.formControls,
                            phase: {
                                ...previousState.formControls.phase,
                                valid: false,
                                touched: true
                            },

                        }
                    }));
                }
            }

        } else {
            // const input = {
            //     phase: { name: this.state.formControls.name.value, tasks: []},
            // };
            //
            let arr;
            const taskList = localStorage.getItem("taskList");
            if (taskList) {
                arr = JSON.parse(taskList);
            }

            const index = this.findPhase(this.state.formControls.phase.value, arr);
            if(!this.doesTaskAlreadyExist(this.state.formControls.name.value, arr[index].phase.tasks)) {
                arr[index].phase.tasks.push({name: this.state.formControls.name.value, checked: false});
                localStorage.setItem('taskList', JSON.stringify(arr));
                this.notifySuccess(`${this.state.formControls.name.value} added to phase ${arr[index].phase.name}`);
                setTimeout(()=> {
                    window.location.reload();
                }, 100);

            } else {
                this.notifyFailed(`Name already exists in the task ${arr[index].phase.name}`);
            }
        }
    };


    findPhase(phase, arr) {
        const result = arr.filter((data) => {
            return data.phase.name.toLowerCase() === phase.toLowerCase();
        });

      //  console.log(result);

        if (result.length > 0) {
           // console.log(result[0]);
            return arr.indexOf(result[0]);
        }
        return null;
    }

    doesTaskAlreadyExist(name, arr) {
        if(arr) {
            const result = arr.filter((data) => {
                // console.log(data);
                return data.name.toLowerCase() === name.toLowerCase();
            });
            return result.length > 0;
        }

        return false;
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

    handleChange(field, event) {
       //  console.log(event);
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
        } else {
            console.log('not');
        }
    }

    render() {
        return (
            <div>
                <h3>Add Task</h3>

                <div>
                    <select className="form-select"
                            name={'selectForPhaseState'}
                            value={this.state.formControls.phase !== undefined ? this.state.formControls.phase.value : '0'}
                            onChange={(e) => this.handleChange('phase', e)}>
                        <option value="0">{this.state.formControls.phase.placeholder}</option>
                        {/*<option value="1">One</option>*/}
                        {this.listOfOptions.map(function (object, i) {
                            return <option value={object.phase.name} key={i}>{object.phase.name}</option>;
                        })}
                    </select>

                    <div className={'text-error text-error-font-size'}>
                        {
                            (() => {
                                    if (this.state.formControls.phase.touched && !this.state.formControls.phase.valid) {
                                        if (!this.state.formControls.phase.value) {
                                            if (this.state.formControls.phase.validationRules.required.state) {
                                                return <span> {this.state.formControls.phase.validationRules.required.message} </span>;
                                            }
                                        }
                                    }
                                }
                            )()
                        }
                    </div>
                </div>

                <div className={'space'}/>

                <div className="input-group">
                    <input type={'email'}
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
                <button type="button" onClick={this.doFormSubmit} className="btn btn-primary btn-lg">Add</button>


            </div>
        );
    }
}
