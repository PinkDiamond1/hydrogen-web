/*
Copyright 2020 Bruno Windels <bruno@windels.cloud>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {TemplateView} from "../../../general/TemplateView.js";

export class ImageView extends TemplateView {
    render(t, vm) {
        // replace with css aspect-ratio once supported
        const heightRatioPercent = (vm.thumbnailHeight / vm.thumbnailWidth) * 100;
        const image = t.img({
            src: vm.thumbnailUrl,
            width: vm.thumbnailWidth,
            height: vm.thumbnailHeight,
            loading: "lazy",
            alt: vm.label,
        });
        const linkContainer = t.a({
            href: vm.url,
            target: "_blank",
            style: `padding-top: ${heightRatioPercent}%; width: ${vm.thumbnailWidth}px;`
        }, image);

        return t.li(
            {className: {"TextMessageView": true, own: vm.isOwn, pending: vm.isPending}},
            t.div({className: "message-container"}, [
                t.div({className: "sender"}, vm => vm.isContinuation ? "" : vm.sender),
                t.div(linkContainer),
                t.p(t.time(vm.date + " " + vm.time)),
            ])
        );
    }
}