
import { React, useState } from 'react';
import loading from '../assets/loading.gif';
import blank from '../assets/blank.png';

interface LoadingIconProps extends React.HTMLElement {
	when?: boolean;
	size?: string;
	delay?: number
	[key: string]: any;
}

export default function LoadingIcon(props: LoadingIconProps) {
	// Note: The delay only works on page load
	const { when: visible = true, size = '20px', delay = 0, ...rest } = props;
	const [isDelayDone, setIsDelayDone]: any = useState(delay == 0);
	if (delay) {
		setTimeout(() => { setIsDelayDone(true); }, delay * 1000);
	}
	return <>
		{  visible && isDelayDone  && <img className="loading-icon" src={loading} alt="loading" width={size} height={size} {...rest} />}
		{!(visible && isDelayDone) && <img className="loading-icon" src={blank}   alt="loading" width={size} height={size} {...rest} />}
	</>;
}
