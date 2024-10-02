document.addEventListener("DOMContentLoaded", function () {
    var phoneInputs = document.querySelectorAll('input[data-tel-input]');

    function getInputNumbersValue(input) {
        // Return input value without any non-digit characters
        return input.value.replace(/\D/g, '');
    }

    function formatWithMask(mask, inputNumbersValue) {
        var formattedValue = '';
        var digitIndex = 0;
        for (var i = 0; i < mask.length; i++) {
            if (mask[i] === '#') {
                if (inputNumbersValue[digitIndex]) {
                    formattedValue += inputNumbersValue[digitIndex];
                    digitIndex++;
                } else {
                    break;
                }
            } else {
                formattedValue += mask[i];
            }
        }
        return formattedValue;
    }

    function onPhoneInput(e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input),
            formattedInputValue = '';

        if (!inputNumbersValue) {
            return (input.value = '');
        }

        var masks = {
            '38': '+38 (###) ###-##-##',
            '1': '+1 (###) ###-##-##'
        };

        var mask = null;

        for (var countryCode in masks) {
            if (inputNumbersValue.startsWith(countryCode)) {
                mask = masks[countryCode];
                break;
            }
        }

        if (mask) {
            formattedInputValue = formatWithMask(mask, inputNumbersValue);
        } else {
            formattedInputValue = '+' + inputNumbersValue;
        }

        input.value = formattedInputValue;
    }

    function onPhoneKeyDown(e) {
        var inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode === 8 && inputValue.length === 1) {
            e.target.value = '';
        }
    }

    function onPhonePaste(e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                input.value = inputNumbersValue;
            }
        }
    }

    for (var phoneInput of phoneInputs) {
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', onPhonePaste, false);
    }
});
