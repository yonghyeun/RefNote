import React from "react";

interface fallbackProps {
  resolve: () => void;
  error: Error;
}

interface ErrorBoundaryProps {
  fallback: ({ resolve, error }: fallbackProps) => JSX.Element;
  children: React.ReactNode;
  shouldHandleError?: (error?: Error) => boolean;
}

interface ErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

/**
 * ErrorBoundary 클래스형 컴포넌트는 자식 컴포넌트에서 발생한 에러를 처리합니다.
 * 이 때 shouldHandleError 함수를 통해 에러를 처리할지 여부를 결정할 수 있습니다.
 * 만약 에러가 캐치 되었으나 shouldHandleError 함수가 없거나 false를 반환하면 에러를 상단 에러 바운더리리로 throw 합니다.
 *
 * fallback 함수는 에러가 발생했을 때 렌더링할 컴포넌트를 반환합니다.
 * fallback 함수는 (fallbackProps)=> <SComponent props= {...fallbackProps}/> 형태로 사용합니다.
 * fallback 으로 인해 렌더링 되는 컴포넌트에서 해당 에러 바운더리의 상태를 조건에 따라 변경할 수 있습니다.
 *
 * @param fallback 에러가 발생했을 때 렌더링할 컴포넌트
 * @param children 에러가 발생할 수 있는 컴포넌트
 * @param shouldHandleError 에러를 처리할지 여부를 결정하는 함수
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, hasError: false };
  }

  componentDidCatch(error: Error) {
    this.setState({
      error,
      hasError: this.props.shouldHandleError
        ? this.props.shouldHandleError(error)
        : false,
    });
  }

  render() {
    if (!this.state.hasError && this.state.error) {
      throw this.state.error;
    }

    return this.state.hasError && this.state.error
      ? this.props.fallback({
          resolve: () => this.setState({ error: null, hasError: false }),
          error: this.state.error,
        })
      : this.props.children;
  }
}
